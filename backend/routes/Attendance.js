import express from "express"
import { getAttendances, createAttendance } from "../controllers/Attendance.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { verifyRole } from "../middlewares/verifyRole.js"
import multer from "multer"

const router = express.Router()
// const upload = multer({ 
//     dest: "uploads/attendanceProofs",
    
// })

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/attendanceProofs');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.username}-${Date.now()}.jpg`);
  }
});

const upload = multer({ storage: storage });

router.get("/attendances", verifyToken, verifyRole(['HR']), getAttendances)
router.post("/attendance", verifyToken, upload.single("imageFile"), createAttendance)

export default router
