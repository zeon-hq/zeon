import axios from "axios";
import { AxiosResponse } from "axios";

export default class CoreService {
    public static sendMail = async (monitorId:string, accountId:string): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {

                const executeMonitorURL = ``;
                return axios.post(executeMonitorURL, {})
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
}