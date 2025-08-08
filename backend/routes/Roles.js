import express from "express"
import { getRoles, getRoleById, createRole, updateRoleById, deleteRoleById } from "../controllers/Roles.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { verifyRole } from "../middlewares/verifyRole.js"

const router = express.Router()

router.get("/roles", verifyToken, verifyRole(['HR']), getRoles)
router.get("/role/:id", verifyToken, verifyRole(['HR']), getRoleById)
router.post("/role", verifyToken, verifyRole(['HR']), createRole)
router.put("/role/:id", verifyToken, verifyRole(['HR']), updateRoleById)
router.delete("/role/:id", verifyToken, verifyRole(['HR']), deleteRoleById)

export default router
