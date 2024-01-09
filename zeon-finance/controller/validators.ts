import Joi from 'joi';

export const createCategorySchema = Joi.object({
    // name must be a string, greater than 3 character and is required
    // error message : "Name is required"
    name: Joi.string().min(3).required().messages({
        'string.base': `Name must be a string`,
        'string.empty': `Name is required`,
        'string.min': `Name should have a minimum length of {#limit}`,
        'any.required': `Name is required`
    }),
    // workspaceId must be a string and is required
    workspaceId: Joi.string().required().messages({
        'string.base': `Workspace ID must be a string`,
        'string.empty': `Workspace ID is required`,
        'any.required': `Workspace ID is required`
    }),
    // any other fields are optional
    description: Joi.string().optional(),
    childCategories: Joi.array().items(Joi.object({
        name: Joi.string().required().messages({
            'string.base': `Child category name must be a string`,
            'string.empty': `Child category name is required`,
            'any.required': `Child category name is required`
        }),
        description: Joi.string().optional()
    })).optional()
    
})

export const createExpenseSchema = Joi.object({
    // name must be a string, greater than 3 character and is required
    // error message : "Name is required"
    // workspaceId must be a string and is required
    workspaceId: Joi.string().required().messages({
        'string.base': `Workspace ID must be a string`,
        'string.empty': `Workspace ID is required`,
        'any.required': `Workspace ID is required`
    }),
    vendor: Joi.string().required().messages({
        'string.base': `Vendor name must be a string`,
        'string.empty': `Vendor name is required`,
        'any.required': `Vendor name is required`
    }),
    invoiceNumber: Joi.string().required().messages({
        'string.base': `Invoice number must be a string`,
        'string.empty': `Invoice number is required`,
        'any.required': `Invoice number is required`
    }),
    invoiceDate: Joi.string().required().messages({
        'string.base': `Invoice date must be a string`,
        'string.empty': `Invoice date is required`,
        'any.required': `Invoice date is required`
    }),
    amount : Joi.object({
        currency: Joi.string().required().messages({
            'string.base': `Amount currency must be a string`,
            'string.empty': `Amount currency is required`,
            'any.required': `Amount currency is required`
        }),
        value: Joi.number().required().messages({
            'number.base': `Amount value must be a number`,
            'number.empty': `Amount value is required`,
            'any.required': `Amount value is required`
        })
    }),
    paymentDate: Joi.string().required().messages({
        'string.base': `Payment date must be a string`,
        'string.empty': `Payment date is required`,
        'any.required': `Payment date is required`
    }),
    tax: Joi.object({
        currency: Joi.string().required().messages({
            'string.base': `Tax currency must be a string`,
            'string.empty': `Tax currency is required`,
            'any.required': `Tax currency is required`
        }),
        value: Joi.number().required().messages({
            'number.base': `Tax value must be a number`,
            'number.empty': `Tax value is required`,
            'any.required': `Tax value is required`
        })
    }),
    categoryId: Joi.string().required().messages({
        'string.base': `Category must be a string`,
        'string.empty': `Category is required`,
        'any.required': `Category is required`
    }),
    // tags are optional
    tags: Joi.array().items(Joi.string()).optional(),
    // customFields are optional
    customFields: Joi.object().optional(),
    isDeleted: Joi.boolean().optional(),
    // status should be either "paid" or "unpaid" or "rejected"
    status: Joi.string().valid('paid', 'unpaid', 'rejected').optional(),
    // attachedDocuments are optional. if present, it should be an array of objects
    // each object should have description, url and key
    // url and key are required
    attachedDocuments: Joi.array().items(Joi.object({
        description: Joi.string().required().messages({
            'string.base': `Description must be a string`,
            'string.empty': `Description is required`,
            'any.required': `Description is required`
        }),
        url: Joi.string().required().messages({
            'string.base': `URL must be a string`,
            'string.empty': `URL is required`,
            'any.required': `URL is required`
        }),
        key: Joi.string().required().messages({
            'string.base': `Key must be a string`,
            'string.empty': `Key is required`,
            'any.required': `Key is required`
        })
    })).optional()
})