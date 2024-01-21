import axios, { AxiosResponse } from "axios";

export interface ISendSlackMessage {
    channelId: string;
    message?: string;
    token: string;
    blocks?: any;
    thread_ts?: string;
}

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

    public static sendSlackMessage = async (sendSlackPayload:ISendSlackMessage): Promise<any> => {
        return new Promise((resolve, reject) => {
            const slackURL = process.env.CORE_SERVICE_URL + '/internal/slack/message';
            try {
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