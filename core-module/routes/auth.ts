import express, { Express, Request, Response, Router } from "express"
import User from "../schema/User"
import { generateId } from "../utils/utils"
import { forgetPasswordController, login, newSignup, resetPasswordController } from "../controller/user"
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const router: Router = express.Router()

router.post("/signup", newSignup)
router.post("/login", login)
router.post("/forgot-password", forgetPasswordController)
router.post("/reset-password", resetPasswordController)
export default router
