import { Request, Response } from "express";
import { CreateTwilioIntegrationDTO } from "../types/types";
import { addTwilioIntegration } from "../functions/twilio";

export default class TwilioController {
  public static async addTwilioIntegration(req: Request, res: Response) {
    try {
      const { workspaceId, accountSid, authToken, phoneNumber } = req.body;

      const param: CreateTwilioIntegrationDTO = {
        workspaceId,
        accountSid,
        authToken,
        phoneNumber,
      };

      const result = await addTwilioIntegration(param);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        "message": "Error while adding Twilio Integration",
        "error": error.message
      });
    }
  }
}
