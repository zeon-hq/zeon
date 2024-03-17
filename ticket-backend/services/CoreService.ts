import axios, { AxiosResponse } from "axios";

const coreServiceUrl = process.env.CORE_SERVICE_URL;
const websiteUrl = process.env.WEBSITE_URL;

export interface ISendSlackMessage {
    channelId: string;
    message?: string;
    token: string;
    blocks?: any;
    thread_ts?: string;
}

interface IAiMessagePayload {
    question:string;
    history:any;
}

export default class CoreService {
    public static sendMail = async (ticketMessage:string, toEmail:string, fromEmail:string, ticketId:string, channelId:string, workspaceId:string): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const mailURLHost = coreServiceUrl + '/internal/communication/send-email';
                console.log('mailURLHost', mailURLHost);

                const sendEmailPayload = {
                    "email": toEmail,
                    "templateId": 27,
                    "params": {
                      ticketlink: `${websiteUrl}/${workspaceId}/chat?channelId=${channelId}&ticketId=${ticketId}`,
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
            const slackURL = coreServiceUrl + '/internal/slack/message';
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

    public static getAIMessage = async (aiMessagePayload:IAiMessagePayload): Promise<any> => {
        return new Promise((resolve, reject) => {
            const aiMessage = coreServiceUrl + '/ai/internal/injest-text';
            try {
                return axios.post(aiMessage, aiMessagePayload)
                    .then(async (response: AxiosResponse<any>) => {
                        if (response.status === 200) {
                            return resolve(response.data);
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