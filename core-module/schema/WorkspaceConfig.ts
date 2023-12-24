import mongoose from "mongoose";
export interface WorkspaceConfigInterface {
    workspaceId: string;
    timezone: string;
    logo ?: string;
    teamSize ?: string;
    industry ?: string;
    legalCompanyName ?: string;
}

// Create a Schema corresponding to the document interface.
const WorkspaceConfigInterface = new mongoose.Schema<WorkspaceConfigInterface>({
    workspaceId: { type: String, required: true },
    timezone: { type: String, required: true, default:"Asia/Kolkata" },
    logo: { type: String, required: false },
    legalCompanyName: { type: String, required: false, default: "" },
    teamSize: { type: String, required: false, default: "" },
    industry: { type: String, required: false, default: "" },
},{
    // add createdAt and updatedAt fields
    timestamps: true

});

// Create a Model.
const WorkspaceConfig = mongoose.model<WorkspaceConfigInterface>('workspace-config', WorkspaceConfigInterface);

export default WorkspaceConfig;