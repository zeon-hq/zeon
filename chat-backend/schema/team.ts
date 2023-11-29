import { model, Schema, Model, Document } from "mongoose";
import mongoose from "mongoose";

export interface IInvoice {
  id: string,
  date: string;
  status: "paid" | "unpaid";
  link: string;
}

export type ITeam = {
  channels: string[];
  invoices: IInvoice[];
  owner: string;
  admins: string[];
  members: string[];
  name: string;
  referralLink: string;
  stripeId: string;
  subscriptionStatus: string;
  subscriptionId: string;
  subscriptionStartDate: number;
  subscriptionEndDate: number;
  trialSubscriptionStartDate: number;
  trialSubscriptionEndDate: number;
  lastPaidInvoiceDate: number;
  widgetLogo: string;
};

const InvoiceSchema: Schema = new Schema(
  {
    date: { type: Date },
    status: { type: String, enum: ["paid, unpaid"], default: "unpaid" },
    link: { type: String },
  },
  { _id: false }
);

const AdminSchema: Schema = new Schema({
  name: String,
  email: String,
});

const TeamSchema: Schema = new Schema({
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
  invoices: [
    {
      id: {type: String, default: ""},
      date: { type: Date },
      status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
      link: { type: String },
    },
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{type: mongoose.Schema.Types.ObjectId, ref: "User", default: []}],
  admins: [{type: mongoose.Schema.Types.ObjectId, ref: "User", default: []}],
  name: { type: String, default: "" },
  referralLink: { type: String, default: "" },
  stripeId: { type: String, default: "" },
  subscriptionStatus: {
    type: String,
    default: "canceled",
  },
  subscriptionId: { type: String, default: ""},
  subscriptionStartDate: {type: Number, default:null},
  subscriptionEndDate: {type: Number, default:null},
  trialSubscriptionStartDate: {type:Number, default: null},
  trialSubscriptionEndDate: {type:Number, default: null},
  lastPaidInvoiceDate: {type:Number, default: null},
  widgetLogo: { type: String, default: "" }
},{
  timestamps:true
});

export const Team: Model<any> = model("Team", TeamSchema);
