import express, { Router } from "express";
import multer from 'multer';
import AIController from "../controller/AIController";
const router: Router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({ storage })

// AI related routes
// upload pdf and injest the data to store in vector's db
router.post('/injest-file', AIController.injestPdf);

router.post('/internal/injest-text', AIController.getInjestPdf);

// get the list of uploaded file 
router.get('/get-uploaded-files/:channelId/:workspaceId', AIController.getUploadedFileList);

// delete the file
router.delete('/delete-file/:fileId', AIController.deleteFile);

// download uploaded file
router.get('/download-file/:fileId', AIController.downloadFile);

router.put('/asset/upload-files', upload.array("files"), AIController.uploadFiles);

export default router;