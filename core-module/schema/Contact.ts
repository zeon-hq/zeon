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
  firstName: string;
  lastName: string;
  jobPosition?: string;
  linkedInUrl?: string;
  emailAddress?: ContactEmail[];
  phoneNumber?: ContactPhoneNumbers[];
  created_at: Date;
  updated_at: Date;
  workspaceId: string;
  contactId: string;
  isDeleted: boolean;
  notes?: string[];
}

const schema = new Schema<Contacts>(
  {
    firstName: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
    },
    lastName: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
    },
    jobPosition: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
    },
    linkedInUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 256,
    },
    emailAddress: {
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
    phoneNumber: {
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
    timestamps: true,
  },
);

export const ContactsModel = model<Contacts>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);