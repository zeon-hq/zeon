import { Request, Response } from 'express';
import axios from "axios";
import { Channel } from '../../schema/channel';
export default class oauthController {

    public static async oauthSlackAuthorize(req: Request, res: Response): Promise<any> {
        try {
            const stateParam = req.query?.state as string;
            const validJsonString = stateParam.replace(/'/g, '"');
            var state: { currentUrl: any; authToken: any, channelId: any };
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

        
        const output = await Channel.findOneAndUpdate({ channelId: state.channelId }, {$set:{ slackChannelId: data.incoming_webhook.channel_id, accessToken: data.access_token }});
            
        if (state?.currentUrl) {
                res.redirect(state?.currentUrl);
              }
            if (data.ok) {
                console.log(`Got access token: ${data.access_token}`);
            } else {
                console.error(`Error getting access token: ${data.error}`);
                res.status(500).json({ error: data.error });
            }

        } catch (error) {

        }
    }
}