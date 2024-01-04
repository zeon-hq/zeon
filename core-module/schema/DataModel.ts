import mongoose, { Schema } from 'mongoose';
import { CRMResourceType, IAdditionalDatafields } from '../types/types'

export interface DataModelInterface {
    resourceType: CRMResourceType;
    resourceId: string;
    fields: IAdditionalDatafields[];
    isDeleted: boolean;

}

// Create a Schema corresponding to the document interface.
const DataModelSchema = new mongoose.Schema<DataModelInterface>({
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true },
    fields: { type: Schema.Types.Mixed, required: false, default: [] },
    isDeleted: { type: Boolean, required: false, default: false}
},{
    timestamps: true

});

// pair of resourceType and resourceId should be unique
DataModelSchema.index({ resourceType: 1, resourceId: 1 }, { unique: true });

// Create a Model.
const DataModel = mongoose.model<DataModelInterface>('data_model', DataModelSchema);

export default DataModel;