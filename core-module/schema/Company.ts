import { Schema, model } from 'mongoose';
import { FormattedPhoneNumber } from './Contact';

export const DOCUMENT_NAME = 'Company';
export const COLLECTION_NAME = 'company';

export enum CompanySize {
    // 1-10
    MICRO = 'micro',
    // 11-50
    SMALL = 'small',
    // 51-200
    MEDIUM = 'medium',
    // 201-500
    LARGE = 'large',
    // 501-1000
    XLARGE = 'xlarge',
    // 1001-5000
    XXLARGE = 'xxlarge',
    // 5001-10000
    XXXLARGE = 'xxxlarge',
    // 10000+
    SUPER = 'super',
  }
  
  export enum CompanyWorth {
    // 0-1M
    MICRO = 'micro',
    // 1M-10M
    SMALL = 'small',
    // 10M-50M
    MEDIUM = 'medium',
    // 50M-100M
    LARGE = 'large',
    // 100M-500M
    XLARGE = 'xlarge',
    // 500M-1B
    XXLARGE = 'xxlarge',
    // 1B-5B
    XXXLARGE = 'xxxlarge',
    // 5B-10B
    SUPER = 'super',
    // 10B+
    MEGA = 'mega',
  }
  
  
  export default interface Company {
    name: string;
    description?: string;
    url?: string;
    x_url?: string;
    linkedin_url?: string;
    location?: string;
    company_size?: CompanySize;
    phone_numbers?: FormattedPhoneNumber[];
    company_worth?: CompanyWorth;
    deal_value?: number;
    products?: string[];
    owner?: string
    interactions?: string[];
    created_at: Date;
    updated_at: Date;
    companyId: string;
    workspaceId: string;
    isDeleted: boolean;
    notes?: string[];
  }

const schema = new Schema<Company>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
    },
    notes: {
      type: [Schema.Types.String],
      required: false,
      default: [],
    },
    description: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
    },
    url: {
      type: Schema.Types.String,
      required: false,
      maxlength: 256,
    },
    x_url: {
      type: Schema.Types.String,
      required: false,
      maxlength: 256,
    },
    linkedin_url: {
      type: Schema.Types.String,
      required: false,
      maxlength: 256,
    },
    location: {
      type: Schema.Types.String,
      required: false,
      maxlength: 256,
    },
    company_size: {
      type: Schema.Types.String,
      enum: Object.values(CompanySize),
      required: false,
      maxlength: 256,
    },
    phone_numbers: {
        type: [{ type: Schema.Types.String }],
        required: false,
    },
    company_worth: {
      type: Schema.Types.String,
      enum: Object.values(CompanyWorth),
      required: false,
      maxlength: 256,
    },
    interactions: {
      type: [Schema.Types.String],
      required: false,
    },
    deal_value: {
      type: Schema.Types.Number,
      required: false,
    },
    products: {
        type: [Schema.Types.String],
        required: false,
    },
    owner: {
      type: Schema.Types.String,
      required: false,
    },
    created_at: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updated_at: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    companyId: {
        type: Schema.Types.String,
        required: true,
    },
    workspaceId: {
        type: Schema.Types.String,
        required: true,
    },
    isDeleted: {
        type: Schema.Types.Boolean,
        required: false,
        default: false,
    }
    },
  {
    versionKey: false,
  },
);

export const CompanyModel = model<Company>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);