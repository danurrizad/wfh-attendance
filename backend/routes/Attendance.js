import express from "express"
import { getAttendances, createAttendanceClockIn, createAttendanceClockOut, checkStatusToday } from "../controllers/Attendance.js"
import { verifyToken } from "../middlewares/verifyToken.js"
import { verifyRole } from "../middlewares/verifyRole.js"
import multer from "multer"

const router = express.Router()

// Multer storage config for clockIn
const storageClockIn = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/attendanceProofs/clockIn');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user.username}-${Date.now()}.jpg`);
    }
});

// Multer storage config for clockOut
const storageClockOut = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/attendanceProofs/clockOut');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.username}-${Date.now()}.jpg`);
  }
});

const uploadClockIn = multer({ storage: storageClockIn });
const uploadClockOut = multer({ storage: storageClockOut });

router.get("/attendances", verifyToken, verifyRole(['HR']), getAttendances)
router.get("/attendance-status/:userId", verifyToken, checkStatusToday)
router.post("/attendance-clockin", verifyToken, uploadClockIn.single("imageFile"), createAttendanceClockIn)
router.post("/attendance-clockout", verifyToken, uploadClockOut.single("imageFile"), createAttendanceClockOut)

export default router
