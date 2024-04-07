import express, { Router } from "express";
import multer from 'multer';
import AIController from "../controller/AIController";
import {verifyIdentity} from "../functions/user";
const router: Router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage })

// AI related routes
// upload pdf and injest the data to store in vector's db
router.post('/injest-file',verifyIdentity, AIController.injestPdf);

router.post('/internal/injest-text',verifyIdentity, AIController.getInjestPdf);

// get the list of uploaded file 
router.get('/get-uploaded-files/:channelId/:workspaceId',verifyIdentity, AIController.getUploadedFileList);

// delete the file
router.delete('/delete-file/:fileId/:channelId/:workspaceId',verifyIdentity, AIController.deleteFile);

// download uploaded file
router.get('/download-file/:fileId', verifyIdentity,AIController.downloadFile);

router.put('/asset/upload-files', [upload.array("files"), verifyIdentity], AIController.uploadFiles);

router.get('/test', AIController.testFuns);

export default router;