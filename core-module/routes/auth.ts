import express, { Router } from "express"
import { forgetPasswordController, login, newSignup, resetPasswordController } from "../controller/user"



const router: Router = express.Router()

router.post("/signup", newSignup)
router.post("/login", login)
router.post("/forgot-password", forgetPasswordController)
router.post("/reset-password", resetPasswordController)
export default router
