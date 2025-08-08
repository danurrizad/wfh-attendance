import express from "express"
import { getUsers, getUserById, createUser, updateUserById, deleteUserById } from "../controllers/Users.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { verifyRole } from "../middlewares/verifyRole.js"

const router = express.Router()

router.get("/users", verifyToken, verifyRole(['HR']), getUsers)
router.get("/user/:id", verifyToken, verifyRole(['HR']), getUserById)
router.post("/user", verifyToken, verifyRole(['HR']), createUser)
router.put("/user/:id", verifyToken, verifyRole(['HR']), updateUserById)
router.delete("/user/:id", verifyToken, verifyRole(['HR']), deleteUserById)

export default router
