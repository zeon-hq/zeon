import mongoose, { Schema, Document, model, Model } from "mongoose";

export enum IAIAgentModelType {
  INBOUND = "INBOUND",
  OUTBOUND = "OUTBOUND",
}

export enum ActionType {
  SEND_SMS = "SEND_SMS",
  BOOK_APPOINTMENT = "BOOK_APPOINTMENT",
  CALL_TRANSFER = "CALL_TRANSFER",
  INFO_EXTRACTOR = "INFO_EXTRACTOR",
}

interface ActionSendSMS extends Document {
  type: ActionType.SEND_SMS;
  content: string;
  condition: string;
}

interface ActionBookAppointment extends Document {
  type: ActionType.BOOK_APPOINTMENT;
  apiKey: string;
  eventID: string;
}

interface ActionCallTransfer extends Document {
  type: ActionType.CALL_TRANSFER;
  phoneNumber: string;
  condition: string;
}

interface ActionInfoExtractorYesNo extends Document {
  type: ActionType.INFO_EXTRACTOR;
  identifier: string;
  question: string;
}

interface ActionInfoExtractorChoice extends Document {
  type: ActionType.INFO_EXTRACTOR;
  identifier: string;
  question: string;
  choices: string[];
}

interface ActionInfoExtractorText extends Document {
  type: ActionType.INFO_EXTRACTOR;
  identifier: string;
  question: string;
  examples: string[];
}

type Action =
  | ActionSendSMS
  | ActionBookAppointment
  | ActionCallTransfer
  | ActionInfoExtractorYesNo
  | ActionInfoExtractorChoice
  | ActionInfoExtractorText;

export interface IAIAgentModel extends Document {
  agentId: string;
  workspaceId: string;
  channelId: string;
  type: IAIAgentModelType;
  name: string;
  voiceId: string;
  elevenLabsApiKey: string;
  responseThrottle: number;
  modelId: string;
  language: string;
  customGreeting: string;
  customVocabulary?: string;
  fileId: string;
  enableRecording: boolean;
  actions: Action[];
  customPrompt?: string;
}

const ActionSendSMSSchema: Schema = new Schema({
  type: { type: String, enum: [ActionType.SEND_SMS], required: true },
  content: { type: String, required: true },
  condition: { type: String, required: true },
});

const ActionBookAppointmentSchema: Schema = new Schema({
  type: { type: String, enum: [ActionType.BOOK_APPOINTMENT], required: true },
  apiKey: { type: String, required: true },
  eventID: { type: String, required: true },
});

const ActionCallTransferSchema: Schema = new Schema({
  type: { type: String, enum: [ActionType.CALL_TRANSFER], required: true },
  phoneNumber: { type: String, required: true },
  condition: { type: String, required: true },
});

const ActionInfoExtractorYesNoSchema: Schema = new Schema({
  type: { type: String, enum: [ActionType.INFO_EXTRACTOR], required: true },
  identifier: { type: String, required: true },
  question: { type: String, required: true },
});

const ActionInfoExtractorChoiceSchema: Schema = new Schema({
  type: { type: String, enum: [ActionType.INFO_EXTRACTOR], required: true },
  identifier: { type: String, required: true },
  question: { type: String, required: true },
  choices: { type: [String], required: true },
});

const ActionInfoExtractorTextSchema: Schema = new Schema({
  type: { type: String, enum: [ActionType.INFO_EXTRACTOR], required: true },
  identifier: { type: String, required: true },
  question: { type: String, required: true },
  examples: { type: [String], required: true },
});

const AIAgentSchema: Schema = new Schema(
  {
    agentId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    channelId: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(IAIAgentModelType),
      required: true,
    },
    name: { type: String, required: true },
    voiceId: { type: String, required: true },
    elevenLabsApiKey: { type: String, required: true },
    responseThrottle: { type: Number, required: true },
    modelId: { type: String, required: true },
    language: { type: String, required: true },
    fileId: { type: String, required: true },
    customGreeting: { type: String, required: true },
    customVocabulary: { type: String },
    enableRecording: { type: Boolean, default: false },
    customPrompt: { type: String },
    actions: { type: [Schema.Types.Mixed], required: true },
  },
  {
    timestamps: true,
  }
);

//@ts-ignore
export const AIAgentModel: Model<IAIAgentModel> = model(
  "aiagent",
  AIAgentSchema
);
