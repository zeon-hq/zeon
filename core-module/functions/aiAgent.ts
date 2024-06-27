import { ICreateAIAgentDTO, ZeonServices } from "../types/types";
import { IAIAgentModel, AIAgentModel } from "../schema/AI-Agent";
import Logger from "./logger";
import { generateId } from "../utils/utils";

const logger = new Logger(ZeonServices.CORE);

export const createAgent = async (
  param: ICreateAIAgentDTO
): Promise<IAIAgentModel> => {
  try {
    if (!param.workspaceId) {
      throw new Error("Workspace ID is required");
    }
    if (!param.channelId) {
      throw new Error("Channel ID is required");
    }
    if (!param.type) {
      throw new Error("Type is required");
    }
    if (!param.name) {
      throw new Error("Name is required");
    }
    if (!param.voiceId) {
      throw new Error("Voice ID is required");
    }
    if (!param.responseThrottle) {
      throw new Error("Response throttle is required");
    }
    if (!param.modelId) {
      throw new Error("Model ID is required");
    }
    if (!param.language) {
      throw new Error("Language is required");
    }
    if (!param.customGreeting) {
      throw new Error("Custom greeting is required");
    }
    if (!param.fileId) {
      throw new Error("File ID is required");
    }
    if (!param.actions) {
      throw new Error("Actions are required");
    }
    if (!param.customPrompt) {
      throw new Error("Custom prompt is required");
    }
    if (!param.enableRecording) {
      throw new Error("Enable recording is required");
    }
    if (!param.customVocabulary) {
      throw new Error("Custom vocabulary is required");
    }

    const agentId = generateId(6);

    const agentData = {
      ...param,
      agentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdAgent = await AIAgentModel.create(agentData);

    logger.info({
      message: "[createAgent] - Agent created",
      payload: createdAgent,
    });

    return createdAgent;
  } catch (error) {
    logger.error({
      message: "[createAgent] - Error creating agent",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

export const updateAgent = async (
  agentId: string,
  agentData: Partial<ICreateAIAgentDTO>
): Promise<IAIAgentModel | null> => {
  try {
    const agentUpdateData = {
      ...agentData,
      updatedAt: new Date(),
    };
    const agent = await AIAgentModel.findByIdAndUpdate(
      agentId,
      agentUpdateData,
      {
        new: true,
      }
    );

    logger.info({
      message: "[updateAgent] - Agent updated",
      payload: agent,
    });

    return agent;
  } catch (error) {
    console.error("Error updating agent:", error);
    logger.error({
      message: "[updateAgent] - Error updating agent",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  try {
    if (!agentId) {
      throw new Error("Agent ID is required");
    }

    await AIAgentModel.findByIdAndDelete(agentId);

    logger.info({
      message: "[deleteAgent] - Agent deleted",
      payload: agentId,
    });
  } catch (error) {
    console.error("Error deleting agent:", error);
    logger.error({
      message: "[deleteAgent] - Error deleting agent",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

export const getAgent = async (
  agentId: string
): Promise<IAIAgentModel | null> => {
  try {
    if (!agentId) {
      throw new Error("Agent ID is required");
    }

    const agent = await AIAgentModel.findById(agentId);
    return agent;
  } catch (error) {
    console.error("Error fetching agent:", error);
    logger.error({
      message: "[getAgent] - Error fetching agent",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

export const listAgents = async (workspaceId: string): Promise<IAIAgentModel[]> => {
  try {
    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }
    
    const agents = await AIAgentModel.find({ workspaceId });
    return agents;
  } catch (error) {
    console.error("Error fetching agents:", error);
    logger.error({
      message: "[listAgents] - Error fetching agents",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};
