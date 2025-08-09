import db from "../utils/db.js";
import moment from "moment-timezone"

export const getAttendances = async(req, res) => {
    try {
        const foundAll = await db.execute(`
            SELECT 
                A.ID,
                A.USER_ID,
                U.NAME,
                A.CLOCKIN_DATE,
                A.IMAGE_PROOF
            FROM
                ATTENDANCES A
            LEFT JOIN
                USERS U ON A.USER_ID = U.ID
            ORDER BY
                A.ID
            `)
        if(foundAll.rows.length === 0){
            return res.status(404).json({ message: "No data found!" })
        }
        const attendances = foundAll.rows.map(row => {
            return {
                ID: row.ID,
                USER_ID: row.USER_ID,
                NAME: row.NAME,
                CLOCKIN_DATE: row.CLOCKIN_DATE,
                IMAGE_PROOF: row.IMAGE_PROOF ? row.IMAGE_PROOF.toString("base64") : null
            };
        });
        // console.log("data: ", foundAll)
        res.status(200).json({ message: "All attendances data found!", data: attendances})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error!", error: error.message })
    } 
}

export const createAttendance = async (req, res) => {
    try {
        const { userId } = req.body; 

        const imagePath = req.file.path;

        if (!userId) {
            return res.status(400).json({ message: "User not found!" });
        }
        if(!imagePath){
            return res.status(400).json({ message: "Please provide your image capture!"})
        }

        const localDateTime = moment().tz("Asia/Jakarta")
        const formattedDateTime = localDateTime.format("YYYY-MM-DD HH:mm:ss")

        const result = await db.execute(
            `INSERT INTO ATTENDANCES (USER_ID, CLOCKIN_DATE, IMAGE_PROOF) 
             VALUES (:userId, :clockInDate, :imageProof)`,
            {
                userId: userId,
                clockInDate: formattedDateTime,
                imageProof: imagePath
            }
        );

        if (result.rowsAffected === 0) {
            return res.status(400).json({ message: "Failed to Clock-In!" });
        }

        res.status(201).json({ message: "Success!" });

    } catch (error) {
        console.log("error create: ", error);
        res.status(500).json({ message: "Internal server error!", error: error.message });
    }
};