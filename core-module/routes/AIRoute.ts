import express, { Router } from "express";
import multer from 'multer';
import path from "path";

import AIController from "../controller/AIController";
import { generateId } from "../utils/utils";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
const router: Router = express.Router();

const secretAccessKey = process.env.SECRET_ACCESS_KEY as string
const accessKeyId = process.env.ACCESS_KEY as string
const bucketName = process.env.BUCKET_NAME as string
const region = process.env.REGION as string

const s3 = new S3Client({
  credentials: {
    secretAccessKey,
    accessKeyId,
  },
  region
})

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, path.join(__dirname, '../controller'))
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + '-' + Date.now() + '.pdf')
//     }
//   });
  
//   // Filter to upload only PDFs
//   const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
  
//   const upload = multer({ storage: storage, fileFilter: fileFilter });


// AI related routes
// upload pdf and injest the data to store in vector's db
router.post('/injest-file', 
// upload.single('pdfFile'), 
AIController.injestPdf);

router.post('/internal/injest-text', AIController.getInjestPdf);

// get the list of uploaded file 
router.get('/get-uploaded-files/:channelId/:workspaceId', AIController.getUploadedFileList);

// delete the file
router.delete('/delete-file/:fileId', AIController.deleteFile);

// download uploaded file
router.get('/download-file/:fileId', AIController.downloadFile);


const storage = multer.memoryStorage()
const upload = multer({ storage })

router.put(
  "/asset/upload-files",
  upload.array("files"), // Allow up to 5 files.
  async (req, res) => {
    try {
      const uploadedUrls = await Promise.all(((req.files || []) as Express.Multer.File[])?.map(async (file: Express.Multer.File) => {
        const tempId = generateId(6);
        const fileName = `${file.originalname}-${tempId}`;
        
        const commandPayload = {
          Bucket: bucketName,
          Key: fileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        }

        const command = new PutObjectCommand(commandPayload);
        await s3.send(command);
        return { url:`https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`,
       fileName: file.originalname,
       mimeType: file.mimetype
      };
      }));

      return res.status(200).json({
        message: "Logos uploaded",
        uploadedUrls: uploadedUrls // This is an array of URLs
      })

    } catch (error) {
      console.log('error message', error?.message);
      return res.status(500).json({
        message: error?.message,
      })
    }
  }
);


export default router;