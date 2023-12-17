import { Request, Response } from 'express';
import { WebClient } from "@slack/web-api";
import axios from "axios";
export default class oauthController {

    public static async oauthSlackAuthorize(req: Request, res: Response): Promise<any> {
        try {
            const stateParam = req.query?.state as string;
            const validJsonString = stateParam.replace(/'/g, '"');
            var state: { currentUrl: any; authToken: any };
            state = JSON.parse(validJsonString);

            if (req?.query?.error) {
                if (state?.currentUrl) {
                    res.redirect(state?.currentUrl);
                }
                return;
            }

            if (!(req?.query?.code)) {
                // Handle missing code parameter
                res.status(400).json({ code: '400', message: "Missing code parameter." });
                return;
            }


            try {
                state = JSON.parse(validJsonString);
                console.log("state: ", state);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                // Handle JSON parsing error
                res.status(400).json({ code: '400', message: "Invalid state parameter." });
                return;
            }

            const slackRedirectionUrl = process.env.SLACK_REDIRECTION_URL;

            const response = await axios({
                method: "get",
                url: "https://slack.com/api/oauth.v2.access",
                params: {
                    code: req.query.code,
                    client_id: process.env.REACT_APP_SLACK_CLIENT_ID,
                    client_secret: process.env.REACT_APP_SLACK_CLIENT_SECRET,
                    redirect_uri: slackRedirectionUrl
                }
            });

            const { data } = response;

            if (data.ok) {
                console.log(`Got access token: ${data.access_token}`);
            } else {
                console.error(`Error getting access token: ${data.error}`);
                res.status(500).json({ error: data.error });
            }

        } catch (error) {

        }
    }

    public static async sendMessage(req: Request, res: Response): Promise<any> {
        try {
            const { channelId, message, token,blocks } = req.body;

            if (!channelId || !(message || blocks) || !token) {
                return res.status(400).send({
                    code: "400",
                    message: "Required parameters missing",
                });
            }


            let channelIdArray = [];
            if (typeof channelId === "string") {
                channelIdArray.push(channelId);
            } else if (Array.isArray(channelId)) {
                channelIdArray = channelId;
            } else {
                return res.status(400).send({
                    code: "400",
                    message: "Invalid channel IDs",
                });
            }

            const web = new WebClient(token);
            const results = [];

            for (const channelId of channelIdArray) {
                // Post a message to a channel
                const result = await web.chat.postMessage({
                    channel: channelId,
                    text: message,
                    blocks:blocks
                });

                results.push({
                    channelId,
                    code: "200",
                    message: `Successfully sent message in conversation ${channelId}`,
                });

            }
            res.status(200).send({
                code: "200",
                message: "Successfully message sent",
                data: results,
            });
        } catch (e) {
            if (e.response) {
                const ZeonResponse = {
                    code: e.response.data ? e.response.data.code : e.response.status,
                    message: e.response.data ? e.response.data.message : e.message,
                    data: e.response.data ? e.response.data.data : null
                };
                return res.status(e.response.status).json(ZeonResponse);
            }
            else if (e) {
                const ZeonResponse = {
                    code: "400",
                    message: e.message
                };
                return res.status(400).json(ZeonResponse);
            }
            else {
                const ZeonResponse = {
                    code: "500",
                    message: e.message || e
                };
                return res.status(500).json(ZeonResponse);
            }
        }
    }
}