import express, { Router } from "express"

import { verifyIdentity } from "zeon-core/dist/func"
import {
  addAdmin,
  changeUserRole,
  createTeam,
  getTeam,
  getTeamData,
  inviteTeamMember,
  removeAdmin,
  removeTeamMember,
  uploadLogo,
} from "../controller/team/team.controller"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import multer from "multer"
import { generateId } from "zeon-core/dist/utils/utils"

const secretAccessKey = process.env.SECRET_ACCESS_KEY as string
const accessKeyId = process.env.ACCESS_KEY_ID as string
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
    try {
      const tempId = generateId(10)
      //@ts-ignore
      const fileName = `${req.file.originalname}-${tempId}`
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        //@ts-ignore
        Body: req.file.buffer,
        //@ts-ignore
        ContentType: req.file.mimetype,
      })
      const savedFile = await s3.send(command)
      const signedURL = await getSignedUrl(s3, command, { expiresIn: 3600 })
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`
      //@ts-ignore
      return res.status(200).json({
              message: "Logo uplodaded",
              uploadedUrl:s3Url
            })
    } catch (error) {
      //@ts-ignore
      return res.status(500).json({
        message: "Something went wrong",
      })
    }
  }
)

module.exports = router
