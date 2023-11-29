import mongoose, { Schema } from 'mongoose';

const invoiceSchema = new Schema({
  id: String,
  date: Date,
  status: String,
  link: String,
  _id: Schema.Types.ObjectId,
});

const teamSchema = new Schema({
  slackChannels: [String], // Assuming these are channel IDs
  owner: Schema.Types.ObjectId,
  members: [Schema.Types.ObjectId],
  admins: [Schema.Types.ObjectId],
  name: String,
  referralLink: String,
  stripeId: String,
  subscriptionStatus: String,
  subscriptionId: String,
  widgetLogo: String,
  invoices: [invoiceSchema],
  __v: Number,
  subscriptionStartDate: Number,
  trialSubscriptionEndDate: Number,
  trialSubscriptionStartDate: Number,
  lastPaidInvoiceDate: Number,
  subscriptionEndDate: Number,
},{
  timestamps:true
});

const TeamModel = mongoose.model('teams', teamSchema);

export default TeamModel;
