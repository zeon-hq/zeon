import axios from "axios";
import { AxiosResponse } from "axios";
import { ISocketTicketPayload } from "../app";

export default class CoreService {
    public static sendMail = async (ticketMessage:string, toEmail:string, fromEmail:string, ticketId:string, channelId:string, workspaceId:string): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const mailURLHost = process.env.CORE_SERVICE_URL + '/internal/communication/send-email';
                console.log('mailURLHost', mailURLHost);

                const sendEmailPayload = {
                    "email": toEmail,
                    "templateId": 27,
                    "params": {
                      ticketlink: `${process.env.WEBSITE_URL}/${workspaceId}/chat?channelId=${channelId}&ticketId=${ticketId}`,
                      ticketmail: fromEmail,
                      ticketmessage: ticketMessage
                    }
                  }
                return axios.post(mailURLHost, sendEmailPayload)
                    .then(async (response: AxiosResponse<any>) => {
                        if (response.status === 200) {
                            return resolve(response.data?.data);
                        } else {
                            return null;
                        }
                    })
                    .catch((error) => {
                        console.error(`Error in Send Mail, Error: ${error?.message || error}`);
                        return resolve(error?.message || error);
                    });
            } catch (error) {
                console.error(`Error in Send Mail, Error: ${error}`);
                return resolve(error);
            }
        });
    }

    public static sendSlackMessage = async (channel:any, message:string, ticketPayload:ISocketTicketPayload): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const slackURL = process.env.CORE_SERVICE_URL + '/internal/slack/message';
                console.log('slackURLHost', slackURL);
                const blocks=[
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "You have a new ticket:\n<fakeLink.toEmployeeProfile.com|Chat Message goes here>"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "Type:\nChannel Name"
                            },
                            {
                                "type": "mrkdwn",
                                "text": `E-Mail:\n${ticketPayload.customerEmail}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": `Ticket ID:\n${ticketPayload.ticketId}`
                            },
                            {
                                "type": "mrkdwn",
                                "text": "Location:\nNew York, United States"
                            }
                        ]
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": message
                        }
                    }
                ]
                const sendSlackPayload = {
                    channelId:channel.slackChannelId, message, token:channel.accessToken, blocks
                  }

                return axios.post(slackURL, sendSlackPayload)
                    .then(async (response: AxiosResponse<any>) => {
                        if (response.status === 200) {
                            return resolve(response.data?.data);
                        } else {
                            return null;
                        }
                    })
                    .catch((error) => {
                        console.error(`Error in Send slack, Error: ${error?.message || error}`);
                        return resolve(error?.message || error);
                    });
            } catch (error) {
                console.error(`Error in Send slack, Error: ${error}`);
                return resolve(error);
            }
        });
    }
}