// routes/Uploads.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder publicly
router.use("/uploads/attendanceProofs", express.static(path.join(__dirname, "../uploads/attendanceProofs")));

export default router;
