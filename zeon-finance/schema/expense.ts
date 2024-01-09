import mongoose, { Document, Model, Schema } from "mongoose";

export interface IExpense {
  expenseId: string;
  workspaceId: string;
  vendor: string;
  invoiceNumber: string;
  invoiceDate: Date;
  paymentDate: Date;
  amount: {
    currency: string;
    value: number;
  };
  tax: {
    currency: string;
    value: number;
  };
  customFields: {
    [key: string]: {
      type: string;
      value: string;
    };
  };
  tags: string[];
  categoryId: string;
  attachedDocuments: {
    description: string;
    url: string;
    key: string;
  }[];
  isDeleted ?: boolean;
  status ?: string;
  totalAmount : {
    currency: string;
    value: number;
  }
}

const expenseSchema: Schema<IExpense> = new mongoose.Schema({
  expenseId: {
    type: String,
    required: true,
  },
  workspaceId: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
    required: true,
  },

  invoiceNumber: {
    type: String,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    currency: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  tax: {
    currency: {
      type: String,
      required: true,
    },
    value: {
      type:String,
      required: true,
    },
  },
  customFields: {
    type: Map,
    of: {
      type: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
    default: {},
  },
  tags: {
    type: [String],
    default: [],
  },
  categoryId: {
    type: String,
    required: true,
    default: "",
  },
  /**
   * attachedDocuments : [
   *  description : string,
   * url : string
   * ]
   */
  attachedDocuments: {
    type: [
      {
        description: String,
        url: String,
      }
    ],
    default: [],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  status: {
    // type is enum
    type: String,
    enum: ["paid", "unpaid", "rejected"],
    default: "unpaid",
  },
  totalAmount: {
    currency: {
      type: String,
      required: true,
    },
    value: {
      type:String,
      required: true
    },
  }
},{
  timestamps: true,
  toObject: { getters: true }
});


const Expense: Model<IExpense> = mongoose.model<IExpense>(
  "Expense",
  expenseSchema
);

export default Expense;
