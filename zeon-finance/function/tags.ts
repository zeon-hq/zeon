import { Tag } from "../schema/tags";

export const getAllTags = async ({workspaceId}: {workspaceId: string}) => {
    try {
        // check if workspaceId is present
        if (!workspaceId) {
            throw new Error("workspaceId is required");
        }
        // get all tags from the database
        const tags = await Tag.find({workspaceId, isDeleted: false}).exec();
        return tags;
    } catch (error) {
        console.error(`Error getting all tags`, error);
        throw error;
    }
}