import axios from "axios";
import { AxiosResponse } from "axios";
import { ISocketTicketPayload } from "../app";
import { ITicketOptions } from "../schema/types/ticket";
import { ILocationApiResponse } from "../type/types";

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

    public static sendSlackMessage = async (channel:any, ticketOptions:ITicketOptions, ticketPayload:ISocketTicketPayload, ticketId:string, locationData:ILocationApiResponse): Promise<any> => {
        return new Promise((resolve, reject) => {
            let locationName;
            if (!locationData?.city || !locationData?.regionName || !locationData?.country) {
                locationName = 'Not Found'
            } else {
                locationName = `${locationData.city}, ${locationData.regionName}, ${locationData.country}` || '';
            }
            try {
                const slackURL = process.env.CORE_SERVICE_URL + '/internal/slack/message';
                console.log('slackURLHost', slackURL);
                const blocks=[
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `You have a new ticket:\n${ticketOptions.message}`
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
                                "text": `Location:\n${locationName}`
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
                            "text": "Head over to your dashboard to reply"
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                              "type": "plain_text",
                              "text": "Go to chat ->"
                            },
                            "url": `${process.env.WEBSITE_URL}/${ticketOptions.workspaceId}/chat?channelId=${ticketOptions.channelId}&ticketId=${ticketId}`
                          }
                    }
                ]
                const sendSlackPayload = {
                    channelId:channel.slackChannelId, message:ticketOptions.message, token:channel.accessToken, blocks
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