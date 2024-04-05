import mongoose, { Schema, Document } from 'mongoose';

export enum IKnowledgeBaseFileUploadStatus {
    UPLOADED_TO_S3 = 'UPLOADED_TO_S3',
    INJECT_STARTED = 'INJECT_STARTED',
    INJECT_COMPLETED = 'INJECT_COMPLETED',
  }

interface IKnowledgeBaseModel extends Document {
    fileId: string;
    workspaceId: string;
    channelId: string;
    fileName: string;
    s3FileUrls: string;
    status: IKnowledgeBaseFileUploadStatus;
    isDeleted: boolean;
}

const KnowledgeBaseModel: Schema = new Schema({
    fileId: {type: String, required: true},
    workspaceId: {type: String, required: true},
    channelId: {type: String, required: true},
    fileName: {type: String},
    s3FileUrls: {type: String},
    status: {type: String, required: true},
    isDeleted: {type: Boolean, default: false}
},{
    timestamps: true
});

export default mongoose.model<IKnowledgeBaseModel>('knowledgebasemodel', KnowledgeBaseModel);