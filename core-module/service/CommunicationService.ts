import axios, { AxiosResponse } from "axios";

interface IEmailParams {
    ticketlink: string;
    ticketmail: string;
    ticketmessage: string;
  }
  
  interface IEmailRecipient {
    email: string;
  }
  
  export interface IEmailTemplate {
    to: IEmailRecipient[];
    templateId: number;
    params: IEmailParams;
  }

export default class CommunicationService {
    public static sendEmail = async (emailPayload:IEmailTemplate) => {
        return new Promise(async (resolve, reject) => {
            return new Promise((resolve, reject) => {
                try {
      
                    const emailSendUrl = `https://api.brevo.com/v3/smtp/email`;
                    return axios.post(emailSendUrl,emailPayload,{
                        headers: {
                            "api-key":process.env.BREVO_KEY,
                        }
                    })
                        .then(async (response: AxiosResponse<any>) => {
                            if (response.status === 201 ) {
                                return resolve(response.data?.messageId);
                            } else {
                                return reject(null);
                            }
                        })
                        .catch((error) => {
                            console.error(`Error Message in sending email from core service, Error: ${error}`);
                            throw reject(error);
                        });
                } catch (error) {
                    console.error(`Error in [sendEmail] communication service, error : ${error}`);
                    return reject(error);
                }
            });
        });
    }
}