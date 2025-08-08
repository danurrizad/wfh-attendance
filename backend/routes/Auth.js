import express from "express"
import { login, logout, refreshToken } from "../controllers/Auth.js"

const router = express.Router()

router.post("/login", login)
router.get("/logout", logout)
router.post("/token", refreshToken)

export default router
