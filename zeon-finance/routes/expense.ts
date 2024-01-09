import { Request, Response } from "express";
import { createExpenseController, deleteExpense, getExpenseByExpenseId, getExpensesByWorkspaceId, updateExpense } from "../controller/expense"
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner" 
import multer from 'multer';
import { generateId } from "zeon-core/dist/utils/utils"
import InvoiceMeta from "../schema/invoice_meta"
import { getAllCategoriesController } from "../controller/category";

const bucketName = process.env.BUCKET_NAME
const region = process.env.REGION

const s3 = new S3Client({
  credentials:{
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId:  process.env.ACCESS_KEY
  },
  region
})



const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const express = require('express');
const router = express.Router();

// Get all expenses
router.get('/:workspaceId', getAllCategoriesController);

// Get an expense by ID
router.get('/:expenseId', getExpenseByExpenseId);

// Create a new expense
router.post('/',upload.single('image'), createExpenseController);

// Update an expense by ID
router.put('/:expenseId', updateExpense);

// Delete an expense by ID
router.delete('/:expenseId', deleteExpense);

// create an api to get image from multer and push to s3
router.post('/upload', upload.single('image'), async (req:Request,res:Response) => {
  try {
    const s3Url = await uploadImage(req,res);
    return res.status(200).json({ message: 'Image uploaded successfully', s3Url });
  } catch (error) {
    console.log(error);
     return res.status(500).json({ message: 'Internal server error' });
  }
});


router.post('/lambda/invoice', async (req:Request, res:Response) => {
  const tempId = req.body.temp_id;
  delete req.body.temp_id;
  const fields = req.body;

  try {
    const invoiceMeta = new InvoiceMeta({
      temp_id: tempId,
      fields
    })
    await invoiceMeta.save();
    return res.status(200).json({ message: 'Invoice meta saved successfully', invoiceMeta });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });

  }
})


// GET ALL EXPENSE FROM A WORKSPACE BY WORKSPACE ID
router.get('/workspace/:workspaceId', getExpensesByWorkspaceId);


export const uploadImage = async (req:Request,res:Response) => {
  try {
    // create a random file name
    const tempId = generateId(10);
    const fileName = `${req.file.originalname}-${tempId}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    const savedFile = await s3.send(command);
    const signedURL = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`
    return {s3Url, key: fileName}
  } catch (error) {
    console.log(error);
     throw new Error('Internal server error');
  }
}

export default router;