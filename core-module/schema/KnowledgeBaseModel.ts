import mongoose, { Schema, Document } from 'mongoose';

export enum IKnowledgeBaseFileUploadProgress {
    UPLOADED_TO_S3 = 'UPLOADED_TO_S3',
    INJECT_STARTED = 'INJECT_STARTED',
    INJECT_COMPLETED = 'INJECT_COMPLETED',
  }

interface IForgotPassword extends Document {
    fileId: string;
    workspaceId: string;
    channelId: string;
    fileName: string;
    s3FileUrls: string;
    progress: IKnowledgeBaseFileUploadProgress;
    isDeleted: boolean;
}

const ForgotPasswordSchema: Schema = new Schema({
    fileId: {type: String, required: true},
    workspaceId: {type: String, required: true},
    channelId: {type: String, required: true},
    fileName: {type: String, required: true},
    s3FileUrls: {type: String, required: true},
    progress: {type: String, required: true},
    isDeleted: {type: Boolean, default: false}
},{
    timestamps: true
});

export default mongoose.model<IForgotPassword>('forgot_password', ForgotPasswordSchema);