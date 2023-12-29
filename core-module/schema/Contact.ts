import { Schema, model } from 'mongoose';

export const DOCUMENT_NAME = 'Contacts';
export const COLLECTION_NAME = 'contacts';

export interface ContactEmail {
  em_id: number;
  email_id: string;
  is_primary: boolean;
}

export interface FormattedPhoneNumber {
  e164: string;
  national: string;
  international: string;
  country: string;
  countryCode: string;
  phone: string;
}

export interface ContactPhoneNumbers {
  pn_id: number;
  phone_number: FormattedPhoneNumber;
  is_primary: boolean;
}

export default interface Contacts {
  first_name: string;
  last_name: string;
  job_position?: string;
  linkedin_url?: string;
  email_address?: ContactEmail[];
  phone_numbers?: ContactPhoneNumbers[];
  created_at: Date;
  updated_at: Date;
  workspaceId: string;
  contactId: string;
  isDeleted: boolean;
  notes?: string[];
}

const schema = new Schema<Contacts>(
  {
    first_name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
    },
    last_name: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
    },
    job_position: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
    },
    linkedin_url: {
      type: Schema.Types.String,
      required: false,
      maxlength: 256,
    },
    email_address: {
        type: [
            {
                em_id: {
                    type: Schema.Types.Number,
                    required: true,
                },
                email_id: {
                    type: Schema.Types.String,
                    required: true,
                },
                is_primary: {
                    type: Schema.Types.Boolean,
                    required: true,
                },
            },
        ],
        required: false,
    },
    phone_numbers: {
        type: [
            {
                pn_id: {
                    type: Schema.Types.Number,
                    required: true,
                },
                phone_number: {
                    type: {
                        e164: {
                            type: Schema.Types.String,
                            required: true,
                        },
                        national: {
                            type: Schema.Types.String,
                            required: true,
                        },
                        international: {
                            type: Schema.Types.String,
                            required: true,
                        },
                        country: {
                            type: Schema.Types.String,
                            required: true,
                        },
                        countryCode: {
                            type: Schema.Types.String,
                            required: true,
                        },
                        phone: {
                            type: Schema.Types.String,
                            required: true,
                        },
                    },
                    required: true,
                },
                is_primary: {
                    type: Schema.Types.Boolean,
                    required: true,
                },
            },
        ],
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
    contactId: {
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
    },
    notes: {
        type: [Schema.Types.String],
        required: false,
        default: [],
    },
  },
  {
    versionKey: false,
  },
);

export const ContactsModel = model<Contacts>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);