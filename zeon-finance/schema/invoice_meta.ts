/**
 * {
 *  temp_id : string,
 *  fields: any[]
 * }
 */
import mongoose, { Model, Schema } from "mongoose"

interface IInvoiceMeta {
    temp_id: string;
    fields: any;
    invoice_url: string;
}

const invoiceMetaSchema = new Schema<IInvoiceMeta>({
    temp_id: { type: String, required: true },
    invoice_url: { type: String, required: true },
    fields: { type: Schema.Types.Array, required: true, default: [] }
});

const InvoiceMeta: Model<IInvoiceMeta> = mongoose.model<IInvoiceMeta>('Invoice_Meta', invoiceMetaSchema);


export default InvoiceMeta;

