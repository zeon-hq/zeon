import mongoose, { Schema, Document } from 'mongoose';

export enum IStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}

interface IAIQuestionLog {
    aiQuestionLogId: string;
    userId: string;
    workspaceId: string;
    channelId: string;
    question: string;
    answer: string;
    status: IStatus;
    error?:string;
}

const AIQuestionLogModel: Schema = new Schema({
    aiQuestionLogId: {type:String},
    userId: {type:String},
    workspaceId: {type:String},
    channelId: {type:String},
    question: {type:String},
    answer: {type:String},
    status: {type: String},
    error: {type: String},
},{
    timestamps: true
});

export default mongoose.model<IAIQuestionLog>('AIQuestionLog', AIQuestionLogModel);