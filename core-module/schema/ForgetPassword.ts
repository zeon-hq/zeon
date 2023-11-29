import mongoose, { Schema, Document } from 'mongoose';

export interface IForgotPassword extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const ForgotPasswordSchema: Schema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<IForgotPassword>('forgot_password', ForgotPasswordSchema);