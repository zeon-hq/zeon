export interface IFinance {
  expense: IExpense;
  categories: ICategory[];
  tags: ITag[];
}

export interface IExpense {
  expenseList: IExpenseDTO[];
  selectedExpense: IExpenseDTO | null;
  createMode: ICreateModeExpense | null;
}

export interface ICreateModeExpense {
  attachedDocuments: any[]
}

export interface IExpenseDTO {
  vendor: string;
  expenseId: string;
  amount: {
    currency: string;
    value: number;
  };
  invoiceDate: string;
  invoiceNumber: string;
  paymentDate: string;
  tax: {
    currency: string;
    value: number;
  };
  totalAmount: {
    currency: string;
    value: number;
  };
  tags: string[];
  categoryId: string;
  workspaceId: string;
  customerFields: [];
  status: string;
  attachedDocuments: {
    description: string;
    url: string;
    key : string;
  }[];
}

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  parentCategory: string;
  categoryId: string;
  isDeleted: boolean;
  workspaceId: string;
  __v: number;
  childCategories: ICategory[];
}
/**
 * {
            "_id": "657cbd9cbee5e9aa0f3ced6d",
            "name": "tag1",
            "tagId": "fb7m1004xl",
            "isDeleted": false,
            "workspaceId": "ymw1tm",
            "__v": 0
        }
 */

export interface ITag {
  _id: string;
  name: string;
  tagId: string;
  isDeleted: boolean;
  workspaceId: string;
  __v: number;
}
