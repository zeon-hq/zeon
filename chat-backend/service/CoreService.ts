import axios from "axios";
import { AxiosResponse } from "axios";

export default class CoreService {

    public static sendSlackMessage = async (channelId:string, message:string, token:string): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const slackURL = process.env.CORE_SERVICE_URL + '/internal/slack/message';
                console.log('slackURLHost', slackURL);

                const sendSlackPayload = {
                    channelId, message, token
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