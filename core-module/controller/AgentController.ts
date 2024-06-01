import { Request, Response } from "express";
import {
  createAgent,
  updateAgent,
  deleteAgent,
  getAgent,
  listAgents,
} from "../functions/aiAgent";
import { ICreateAIAgentDTO } from "../types/types";
import Twilio from "../schema/Twilio";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";

export default class AgentController {
  public static async incomingCallHandler(req: Request, res: Response) {
    console.log("Incoming Call Handler Initiated");
    const { agentId } = req.params;

    console.log(agentId, req.headers.host);
    const twiml = new VoiceResponse();

    twiml.connect().stream({
      url: `wss://${req.headers.host}/incoming-call/${agentId}`,
    });

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  public static async createAgent(req: Request, res: Response) {
    try {
      const {
        workspaceId,
        channelId,
        type,
        name,
        voiceId,
        responseThrottle,
        modelId,
        language,
        customGreeting,
        customVocabulary,
        fileId,
        enableRecording,
        actions,
        customPrompt,
      } = req.body;

      const param: ICreateAIAgentDTO = {
        workspaceId,
        channelId,
        type,
        name,
        voiceId,
        responseThrottle,
        modelId,
        language,
        customGreeting,
        customVocabulary,
        fileId,
        enableRecording,
        actions,
        customPrompt,
      };

      // Create agent
      const createdAgent = await createAgent(param);

      // get twilio info from workspaceId
      const twilioInfo = await Twilio.findOne({
        workspaceId: workspaceId,
      });

      const client = require("twilio")(
        twilioInfo.accountSid,
        twilioInfo.authToken
      );

      // find phone number with the given number
      const pnNumber = await client.incomingPhoneNumbers.list({
        phoneNumber: twilioInfo.phoneNumber,
      });

      client.incomingPhoneNumbers(pnNumber[0].sid).update({
        voiceUrl: `https://273b-2405-201-6020-d031-681d-df79-9152-2ade.ngrok-free.app/incoming/${createdAgent.agentId}`,
      });

      res.status(201).json(createdAgent);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: "Bad Request",
        error: error.message.message,
      });
    }
  }

  public static async updateAgent(req: Request, res: Response) {
    try {
      const { agentId } = req.params;
      const {
        workspaceId,
        channelId,
        type,
        name,
        voiceId,
        responseThrottle,
        modelId,
        language,
        customGreeting,
        customVocabulary,
        fileId,
        enableRecording,
        actions,
        customPrompt,
      } = req.body;

      const param: ICreateAIAgentDTO = {
        workspaceId,
        channelId,
        type,
        name,
        voiceId,
        responseThrottle,
        modelId,
        language,
        customGreeting,
        customVocabulary,
        fileId,
        enableRecording,
        actions,
        customPrompt,
      };

      // Update agent
      const updatedAgent = await updateAgent(agentId, param);
      res.status(200).json(updatedAgent);
    } catch (error) {
      res.status(500).json({ error: "Bad Request" });
    }
  }

  public static async deleteAgent(req: Request, res: Response) {
    try {
      const { agentId } = req.query;

      // Delete agent
      await deleteAgent(agentId as string);
      res.status(204).json();
    } catch (error) {
      res
        .status(400)
        .json({ message: "Bad Request", error: error.message.message });
    }
  }

  public static async getAgent(req: Request, res: Response) {
    try {
      const { agentId } = req.query;

      // Get agent
      const agent = await getAgent(agentId as string);
      res.status(200).json(agent);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Bad Request", error: error.message.message });
    }
  }

  public static async listAgents(req: Request, res: Response) {
    try {
      const { workspaceId } = req.query;

      console.log(workspaceId);

      // List agents
      const agents = await listAgents(workspaceId as string);
      res.status(200).json(agents);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Bad Request", error: error.message.message });
    }
  }
}
