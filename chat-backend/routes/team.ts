import express, { Router } from "express"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import multer from "multer"
import { verifyIdentity } from "zeon-core/dist/func"
import { generateId } from "zeon-core/dist/utils/utils"
import {
  addAdmin,
  changeUserRole,
  createTeam,
  getTeam,
  getTeamData,
  inviteTeamMember,
  removeAdmin,
  removeTeamMember
} from "../controller/team/team.controller"

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

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router: Router = express.Router()

// Team management
router.post("/", verifyIdentity, createTeam)
router.get("/", verifyIdentity, getTeam)
router.put("/invite", verifyIdentity, inviteTeamMember)
router.put("/cancel-invite", verifyIdentity, removeTeamMember)
router.put("/add-admin", verifyIdentity, addAdmin)
router.put("/remove-admin", verifyIdentity, removeAdmin)
router.put("/role", verifyIdentity, changeUserRole)

router.get("/:workspaceId", getTeamData)
// Team assets
router.put(
  "/asset/upload-logo",
  verifyIdentity,
  upload.single("file"),
  //@ts-ignore
  async (req: Request, res: Response) => {
    console.log('--------------')
    try {
      const tempId = generateId(10)
      //@ts-ignore
      const fileName = `${req.file.originalname}-${tempId}`
      const commandPayload = {
        Bucket: bucketName,
        Key: fileName,
        //@ts-ignore
        Body: req.file.buffer,
        //@ts-ignore
        ContentType: req.file.mimetype,
      }
      const command = new PutObjectCommand(commandPayload)
      console.log('fileName',commandPayload);

      console.log('command',command);
      
      
      await s3.send(command)
      await getSignedUrl(s3, command, { expiresIn: 3600 })
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`
      //@ts-ignore
      return res.status(200).json({
              message: "Logo uplodaded",
              uploadedUrl:s3Url
            })
    } catch (error:any) {
      console.log('error message',error?.message);
      //@ts-ignore
      return res.status(500).json({
        message: error?.message,
      })
    }
  }
)

module.exports = router
