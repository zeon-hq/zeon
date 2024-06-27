import TwilioSDK from "twilio";
import TwilioModel from "../schema/Twilio";

export default class TwilioService {
  private static twilioClient: TwilioSDK.Twilio;
  private static twilioAccountSid: string;
  private static twilioAuthToken: string;
  private static twilioPhoneNumber: string;

  constructor(workspaceId: string) {
    TwilioService.initializeTwilio(workspaceId);
  }

  private static async initializeTwilio(workspaceId: string) {
    try {
      const twilioData = await TwilioModel.findOne({ workspaceId });

      if (!twilioData) {
        throw new Error("Twilio data not found for workspace");
      }

      TwilioService.twilioAccountSid = twilioData.accountSid;
      TwilioService.twilioAuthToken = twilioData.authToken;
      TwilioService.twilioPhoneNumber = twilioData.phoneNumber;

      TwilioService.twilioClient = TwilioSDK(
        TwilioService.twilioAccountSid,
        TwilioService.twilioAuthToken
      );

      console.log("Twilio initialized successfully");
    } catch (error) {
      console.error(`Error initializing Twilio: ${error}`);
    }
  }

  public static sendSMS = async (to: string, body: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!TwilioService.twilioClient) {
            throw new Error("Twilio not initialized");
        }
        return TwilioService.twilioClient.messages
          .create({
            body,
            from: TwilioService.twilioPhoneNumber,
            to,
          })
          .then((message) => {
            console.log(`SMS sent successfully, MessageId: ${message.sid}`);
            return resolve(message.sid);
          })
          .catch((error) => {
            console.error(
              `Error Message in sending SMS from core service, Error: ${error}`
            );
            throw reject(error);
          });
      } catch (error) {
        console.error(
          `Error in [sendSMS] communication service, error : ${error}`
        );
        return reject(error);
      }
    });
  };

  public static outboundCall = async (
    to: string,
    from: string,
    url: string
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!TwilioService.twilioClient) {
            throw new Error("Twilio not initialized");
        }
        return TwilioService.twilioClient.calls
          .create({
            url,
            to,
            from,
          })
          .then((call) => {
            console.log(`Call initiated successfully, CallId: ${call.sid}`);
            return resolve(call.sid);
          })
          .catch((error) => {
            console.error(
              `Error Message in initiating call from core service, Error: ${error}`
            );
            throw reject(error);
          });
      } catch (error) {
        console.error(
          `Error in [outboundCall] communication service, error : ${error}`
        );
        return reject(error);
      }
    });
  };
}
