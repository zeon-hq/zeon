import { Request, Response } from "express"
import Expense, { IExpense } from "../schema/expense"
import { generateId } from "zeon-core/dist/utils/utils"
import { validator } from "../utils/utils"
import { createExpenseSchema } from "./validators"
import { Tag } from "../schema/tags"
import { getAllExpenses } from "../function/expense"
import { uploadImage } from "../routes/expense"

export const createExpenseController = async (req: Request, res: Response) => {
  try {
    const {
      vendor,
      invoiceNumber,
      invoiceDate,
      paymentDate,
      amount,
      tax,
      customFields,
      workspaceId,
      categoryId,
      tags,
      status,
      attachedDocuments
    }: IExpense = req.body

    validator(createExpenseSchema, req.body)

    const expenseId = generateId(10)

    const newExpense: IExpense = {
      expenseId,
      workspaceId,
      vendor,
      invoiceNumber,
      invoiceDate,
      paymentDate,
      amount,
      tax,
      categoryId,
      customFields,
      tags: [],
      attachedDocuments,
      status,
      totalAmount: {
        currency: amount.currency,
        value: amount.value + tax.value
      },
    }

    if(!status) {
      newExpense.status = "unpaid"
    }

    // check if customFields is present
    if(!customFields) {
      newExpense.customFields = {}
    }

    // create tags
    try {
      // loop through tags array
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i]
        // check if tag already exists
        const existingTag = await Tag.findOne({ name: tag, workspaceId })
        if (existingTag) {
          newExpense.tags.push(existingTag.name)
          continue
        }
        // create tag
        const newTag = await Tag.create({
          name: tag,
          value: tag,
          workspaceId,
          tagId: generateId(10),
        })
        newExpense.tags.push(newTag.name)
      }

      // create expense
      try {
        const createdExpense = await Expense.create(newExpense)
        // if(req.file.originalname) {
        //   const s3Url = await uploadImage(req,res);
        //   const attachedDocuments = {
        //     description: req.file.originalname,

        //     url: s3Url
        //   }
        //   createdExpense.attachedDocuments.push(attachedDocuments)
        //   await createdExpense.save()
        // }
        return res.status(200).json(newExpense)
      } catch (error) {
        console.error(`Error creating expense:`, error)
        return res.status(500).json({ message: "Error while creating expense" })
      }

    } catch (error) {
      console.error(`Error creating tags:`, error)
      // return res.status(500).json({ message: "Error while creating tags" })
    }

    const expense = await Expense.create(newExpense)

    // create tags from tags array

    res.status(201).json(expense)
  } catch (error) {
    console.error("Error creating new expense:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getExpenseByExpenseId = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId

    const expense: IExpense | null = await Expense.findOne({
      expenseId: expenseId,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.status(200).json(expense)
  } catch (error) {
    console.error("Error getting expense by ID:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId
    const data: IExpense = req.body
    const tags = req.body.tags

    // find expense
    const newExpense: IExpense | null = await Expense.findOne({
      expenseId,
    })

    if (!newExpense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    const updatedTags = [...tags]

    // calculate total amounts
    const totalAmount = data.amount.value + data.tax.value

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      // check if tag already exists
      const existingTag = await Tag.findOne({ name: tag, workspaceId: newExpense.workspaceId })
      if (existingTag) {
        updatedTags.push(existingTag.name)
        continue
      }
      // create tag
      const newTag = await Tag.create({
        name: tag,
        value: tag,
        workspaceId: newExpense.workspaceId,
        tagId: generateId(10),
      })
      newExpense.tags.push(newTag.name)
    }

    data.totalAmount = {
      currency: data.amount.currency,
      value: totalAmount
    }

    const expense: IExpense | null = await Expense.findOneAndUpdate(
      { expenseId },
      data,
      { new: true }
    )

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.status(200).json(expense)
  } catch (error) {
    console.error("Error updating expense:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId
    //@ts-ignore
    const expense: IExpense | null = await Expense.findOneAndDelete({
      expenseId,
    })

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }

    res.status(200).json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getExpensesByWorkspaceId = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId

    const expenses: IExpense[] = await Expense.find({ workspaceId })

    res.status(200).json(expenses)
  } catch (error) {
    console.error("Error getting expenses by workspace ID:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getAllExpensesController = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.workspaceId
    const expenses = await getAllExpenses({ workspaceId })
    res.status(200).json({expenses})
  } catch (error) {
    console.error("Error getting all expenses:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}