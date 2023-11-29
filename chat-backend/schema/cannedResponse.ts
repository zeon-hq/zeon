import { model, Schema, Model, Document } from "mongoose";
import mongoose from "mongoose";

interface ICannedResponse {
  title: string;
  message: string;
}

const CannedResponseSchema: Schema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
},{timestamps:true});

//@ts-ignore
export const CannedResponse: Model<ICannedResponse> = model("CannedResponse", CannedResponseSchema);
