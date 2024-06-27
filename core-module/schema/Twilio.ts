import mongoose from "mongoose"

export interface TwilioInterface {
    twilioId: string;
    workspaceId: string;
    accountSid: string;
    authToken: string;
    phoneNumber: string;
}

const TwilioSchema = new mongoose.Schema<TwilioInterface>({
    twilioId: { type: String, required: true },
    workspaceId: { type: String, required: true },
    accountSid: { type: String, required: true },
    authToken: { type: String, required: true },
    phoneNumber: { type: String, required: true },
},{
    timestamps: true
})

TwilioSchema.index({ twilioId: 1, workspaceId: 1 }, { unique: true })

const Twilio = mongoose.model<TwilioInterface>("twilio", TwilioSchema)

export default Twilio;
