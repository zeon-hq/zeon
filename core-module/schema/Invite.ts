import mongoose from 'mongoose';

export interface InviteInterface {
    email: string;
    workspaceId: string;
    roleId: string;
    inviteId: string;
    isRejected : boolean;
    isAccepted : boolean;
    isDeleted: boolean;
}

// Create a Schema corresponding to the document interface.

const InviteSchema = new mongoose.Schema<InviteInterface>({
    email: { type: String, required: true },
    workspaceId: { type: String, required: true },
    roleId: { type: String, required: true },
    inviteId: { type: String, required: true },
    isRejected: { type: Boolean, required: true, default: false },
    isAccepted: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
},{
    timestamps: true
});

// Create a Model.
const Invite = mongoose.model<InviteInterface>('Invite', InviteSchema);

export default Invite;