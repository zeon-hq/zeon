import Logger from "./logger";
import { ZeonServices, CreateTwilioIntegrationDTO } from "../types/types";
import Twilio, { TwilioInterface } from "../schema/Twilio";
import { generateId } from "../utils/utils";

const logger = new Logger(ZeonServices.CORE);

export const addTwilioIntegration = async (
  param: CreateTwilioIntegrationDTO
): Promise<TwilioInterface> => {
  try {
    if (!param.workspaceId) {
      throw new Error("Workspace ID is required");
    }

    if (!param.accountSid) {
      throw new Error("Account SID is required");
    }

    if (!param.authToken) {
      throw new Error("Auth Token is required");
    }

    if (!param.phoneNumber) {
      throw new Error("Phone is required");
    }

    const twilioId = generateId(6);

    const twilioData = {
      ...param,
      twilioId,
    };

    const twilio = new Twilio(twilioData);
    await twilio.save();

    logger.info({
      message: "Twilio integration added",
      payload: param,
    });

    return twilio;
  } catch (error) {
    logger.error({
      message: error.message,
      payload: param,
    });
    throw error;
  }
};
