import Workspace, { WorkspaceInterface } from "../schema/Workspace";
import WorkspaceConfig from "../schema/WorkspaceConfig";
import { CreateWorkspaceDTO, ZeonServices } from "../types/types";
import { generateId } from "../utils/utils";
import { createRole } from "./role";
import mongoose from "mongoose";
import { createBulkCategory } from "../service/FinanceService";
//@ts-ignore
import categoriesJSON from "./category.json";
import Logger from "./logger";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const logger = new Logger(ZeonServices.CORE);

export const createWorkspace = async (
  params: CreateWorkspaceDTO
): Promise<WorkspaceInterface> => {
  try {
    const {
      workspaceName,
      primaryContactName,
      primaryContactEmail,
      signupDetails,
      modules,
      legalCompanyName,
      teamSize,
      industry,
    } = params;

    // check if all the params are present
    if (
      !workspaceName ||
      !primaryContactEmail ||
      !primaryContactName ||
      !signupDetails ||
      !modules
    ) {
      throw {
        code: 400,
        message: "Missing parameters",
        error: "Missing parameters",
      };
    }

    // create a customer in stripe
    const stripeCustomer = await stripe.customers.create({
      email: primaryContactEmail,
      name: primaryContactName,
    });

    const customerId = stripeCustomer.id;

    // Generate a workspaceId
    const workspaceId = generateId(6);

    // Create a new workspace
    const workspace = new Workspace({
      workspaceName,
      primaryContactName,
      primaryContactEmail,
      signupDetails,
      workspaceId: workspaceId,
      modules,
      stripeCustomerId: customerId,
    });

    // Save the workspace to the database
    await workspace.save();

    // create owner role
    await createRole({
      name: "Owner",
      description: "Owner of the workspace",
      workspaceId: workspace.workspaceId,
      roleId: "owner",
    });

    // create member role
    await createRole({
      name: "Chat Agent",
      description: "Chat Agent of the workspace",
      workspaceId: workspace.workspaceId,
      roleId: "chatAgent",
    });

    // create admin role
    await createRole({
      name: "Admin",
      description: "Admin of the workspace",
      workspaceId: workspace.workspaceId,
      roleId: "admin",
    });

    // // create cateogries
    // const res = await createBulkCategory({
    //   workspaceId: workspace.workspaceId,
    //   categories: categoriesJSON
    // })

    // create workspace config
    await WorkspaceConfig.create({
      workspaceId: workspace.workspaceId,
      legalCompanyName,
      teamSize,
      industry,
    });

    const data = {
      ...workspace.toObject(),
      workspaceConfig: {
        workspaceId: workspace.workspaceId,
      },
    };

    logger.info({
      message: "[createWorkspace] - Workspace created",
      payload: data,
    });

    return data;
  } catch (error) {
    console.error(error);
    logger.error({
      message: "[createWorkspace] - Error creating workspace",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

export const getWorkspaceByWorkspaceId = async (
  workspaceId: string
): Promise<WorkspaceInterface> => {
  try {
    const workspace = await Workspace.findOne({ workspaceId: workspaceId });

    if (!workspace) {
      throw {
        code: 500,
        message: "Workspace not found",
        error: "Workspace not found",
      };
    }

    // check if workspace is deleted
    if (workspace.isDeleted) {
      throw {
        code: 500,
        message: "Workspace not found",
        error: "Workspace not found",
      };
    }

    // get workspaceConfig

    const workspaceConfig = await WorkspaceConfig.findOne({
      workspaceId: workspaceId,
    });

    const data = {
      ...workspace.toObject(),
      workspaceConfig,
    };

    return data;
  } catch (error) {
    console.error(error);
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

export const deleteWorkspaceByWorkspaceId = async (
  workspaceId: string
): Promise<WorkspaceInterface> => {
  try {
    const workspace = await Workspace.findOne({ workspaceId: workspaceId });

    if (!workspace) {
      throw {
        code: 500,
        message: "Workspace not found",
        error: "Workspace not found",
      };
    }

    // update isDeleted to true
    workspace.isDeleted = true;
    logger.info({
      message: "[deleteWorkspaceByWorkspaceId] - Workspace deleted",
      payload: workspace,
    });
    await workspace.save();
    return workspace;
  } catch (error) {
    console.error(error);
    logger.error({
      message: "[deleteWorkspaceByWorkspaceId] - Error deleting workspace",
      error: error,
    });
    throw {
      code: 500,
      message: error,
      error,
    };
  }
};

// Retry logic for database connection
const connectWithRetry = async (retries = 5, delay = 5000): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME,
        maxPoolSize: 10, // Adjust the pool size as needed
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        keepAlive: true,
        keepAliveInitialDelay: 300000, // Keep-alive ping interval in milliseconds
      });
      console.log("Connected to DB in core module");
      // Ping the database periodically to keep the connection alive
      const pingInterval = 5*60*1000 // Ping every 5 minutes

      setInterval(async () => {
        try {
          await mongoose.connection.db.command({ ping: 1 });
          console.log("Pinged MongoDB");
        } catch (err) {
          console.error("Failed to ping MongoDB", err);
          logger.error({
            message: "[initializeDB] - Failed to ping MongoDB",
            error: err,
          });
        }
      }, pingInterval);
      return; // Exit function if connection is successful
    } catch (e) {
      console.log(
        `Attempt ${attempt} to connect to DB failed. Retrying in ${
          delay / 1000
        } seconds...`
      );
      logger.error({
        message: `[initializeDB] - Attempt ${attempt} - Error connecting to DB. Retrying...`,
        error: e,
      });
      if (attempt === retries) {
        console.log(
          "Failed to connect to DB after multiple attempts. Exiting..."
        );
        logger.error({
          message:
            "[initializeDB] - Failed to connect to DB after multiple attempts. Exiting...",
          error: e,
        });
        process.exit(1); // Exit process if all retries fail
      }
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
};

export const initializeDB = async (): Promise<void> => {
  await connectWithRetry();
};
