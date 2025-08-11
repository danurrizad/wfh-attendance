import db from "../utils/db.js";
import moment from "moment-timezone"

export const getAttendances = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const q = req.query.q || '';
        const startDate = req.query.startDate || '';
        const endDate = req.query.endDate || '';
        const offset = (page - 1) * limit;
        let binds = {}

        // Base query for counting data
        let baseQuery = `
            FROM
                ATTENDANCES A
            LEFT JOIN
                USERS U ON A.USER_ID = U.ID
        `;

        // Add search condition q
        let whereClause = '';
        if (q) {
            whereClause = `
                WHERE LOWER(U.NAME) LIKE '%' || LOWER(:q) || '%'
                OR LOWER(U.USERNAME) LIKE '%' || LOWER(:q) || '%'
            `
            binds.q = q
        }

        // Add search condition startDate and endDate
        if (startDate || endDate) {
            if (whereClause !== '') {
                whereClause += ` AND `;
            } else {
                whereClause += ` WHERE `;
            }

            // Add the date conditions
            if (startDate) {
                whereClause += `TRUNC(TO_DATE(A.CLOCKIN_DATE, 'YYYY-MM-DD HH24:MI:SS')) >= TO_DATE(:startDate, 'YYYY-MM-DD HH24:MI:SS')`;
                binds.startDate = startDate;
            }
            if (startDate && endDate) {
                whereClause += ` AND `;
            }
            if (endDate) {
                whereClause += `TRUNC(TO_DATE(A.CLOCKIN_DATE, 'YYYY-MM-DD HH24:MI:SS')) <= TO_DATE(:endDate, 'YYYY-MM-DD HH24:MI:SS')`;
                binds.endDate = endDate;
            }
        }

        // Get the total count data
        const totalRowsResult = await db.execute(`
            SELECT COUNT(*) AS TOTAL_ROWS
            ${baseQuery}
            ${whereClause}
        `,  binds );
        const totalRows = totalRowsResult.rows[0].TOTAL_ROWS;
        const totalPages = Math.ceil(totalRows / limit);


        // Fetch the paginated data
        binds.offset = offset
        binds.limit = limit
        const foundAll = await db.execute(`
            SELECT 
                A.ID,
                A.USER_ID,
                U.NAME,
                U.USERNAME,
                A.CLOCKIN_DATE,
                A.CLOCKOUT_DATE,
                A.CLOCKIN_IMAGE_PROOF,
                A.CLOCKOUT_IMAGE_PROOF
            ${baseQuery}
            ${whereClause}
            ORDER BY A.ID
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        `,  binds );

        if (foundAll.rows.length === 0) {
            return res.status(404).json({ message: "No data found!" });
        }

        // Change format image into string base64
        const attendances = foundAll.rows.map(row => {
            return {
                ID: row.ID,
                USER_ID: row.USER_ID,
                NAME: row.NAME,
                USERNAME: row.USERNAME,
                CLOCKIN_DATE: row.CLOCKIN_DATE,
                CLOCKOUT_DATE: row.CLOCKOUT_DATE,
                CLOCKIN_IMAGE_PROOF: row.CLOCKIN_IMAGE_PROOF ? row.CLOCKIN_IMAGE_PROOF.toString("base64") : null,
                CLOCKOUT_IMAGE_PROOF: row.CLOCKOUT_IMAGE_PROOF ? row.CLOCKOUT_IMAGE_PROOF.toString("base64") : null
            };
        });

        res.status(200).json({ 
            message: "All attendances data found!", 
            data: attendances,
            pagination: {
                page: page,
                limit: limit,
                totalPage: totalPages,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error!", error: error.message });
    } 
}

export const createAttendanceClockIn = async (req, res) => {
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
        const todayDate = localDateTime.format("YYYY-MM-DD")

        // Check if already clock in for today
        const userAttendanceToday = await db.execute(`
            SELECT 
                USER_ID, CLOCKIN_DATE, CLOCKOUT_DATE 
            FROM 
                ATTENDANCES 
            WHERE 
                USER_ID = :userId
                AND TRUNC(TO_DATE(CLOCKIN_DATE, 'YYYY-MM-DD HH24:MI:SS')) = TO_DATE(:todayDate, 'YYYY-MM-DD')
        `, {
            userId: userId,
            todayDate: todayDate,
        })

        if(userAttendanceToday.rows.length !== 0){
            return res.status(400).json({ message: "You have already clocked in!" })
        }
        

        const result = await db.execute(
            `INSERT INTO ATTENDANCES (USER_ID, CLOCKIN_DATE, CLOCKIN_IMAGE_PROOF) 
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

export const createAttendanceClockOut = async(req, res) => {
    try{
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
        const todayDate = localDateTime.format("YYYY-MM-DD")


        // Check if already clock in for today
        const userAttendance = await db.execute(`
            SELECT 
                USER_ID, CLOCKIN_DATE, CLOCKOUT_DATE 
            FROM 
                ATTENDANCES 
            WHERE 
                USER_ID = :userId
                AND TRUNC(TO_DATE(CLOCKIN_DATE, 'YYYY-MM-DD HH24:MI:SS')) = TO_DATE(:todayDate, 'YYYY-MM-DD')
        `, {
            userId: userId,
            todayDate: todayDate,
        })
        if(userAttendance.rows.length === 0){
            return res.status(400).json({ message: "You have not clock in yet! Please clock in first." })
        }
        if(userAttendance.rows[0].CLOCKOUT_DATE !== null){
            return res.status(400).json({ message: "You have already clocked out today!" })
        }

        const result = await db.execute(
            `UPDATE 
                ATTENDANCES 
            SET 
                CLOCKOUT_DATE = :clockOutDate, 
                CLOCKOUT_IMAGE_PROOF = :imageProof 
            WHERE 
                USER_ID = :userId
                AND TRUNC(TO_DATE(CLOCKIN_DATE, 'YYYY-MM-DD HH24:MI:SS')) = TO_DATE(:todayDate, 'YYYY-MM-DD')
             `,
            {
                userId: userId,
                clockOutDate: formattedDateTime,
                imageProof: imagePath,
                todayDate: todayDate
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
}

export const checkStatusToday = async(req, res) => {
    try {
        const { userId } = req.params
        if(!userId){
            return res.status(400).json({ message: "User ID is required!" })
        }
        if(isNaN(userId)){
            return res.status(400).json({ message: "Invalid user ID!"})
        }

        // Get today string
        const localDateTime = moment().tz("Asia/Jakarta")
        const formattedDateTime = localDateTime.format("YYYY-MM-DD HH:mm:ss")

        // Find attendance
        const foundAttendance = await db.execute(`
            SELECT USER_ID, CLOCKIN_DATE, CLOCKOUT_DATE 
            FROM ATTENDANCES 
            WHERE USER_ID = :userId 
            AND TRUNC(TO_DATE(CLOCKIN_DATE, 'YYYY-MM-DD HH24:MI:SS')) = TRUNC(TO_DATE(:formattedDateTime, 'YYYY-MM-DD HH24:MI:SS'))
            `, {
                userId: userId,
                formattedDateTime: formattedDateTime
            })

        // If there is no attendance
        if(foundAttendance.rows.length === 0){
            return res.status(200).json({ 
                message: "Status user found!", 
                data: {
                    status: "NOT CLOCKED IN",
                    clockInDate: "",
                    clockOutDate: ""
                }
            })
        }

        const dataAttendance = foundAttendance.rows[0]
        
        const status = dataAttendance.CLOCKOUT_DATE !== null ? "CLOCKED OUT" : "CLOCKED IN"
        
        // If there is 
        res.status(200).json({
            message: "Status user found!",
            data: {
                status: status,
                clockInDate: dataAttendance.CLOCKIN_DATE,
                clockOutDate: dataAttendance.CLOCKOUT_DATE
            }
        })
            
    } catch (error) {
        console.log("error checking status: ", error)
        res.status(500).json({ message: "Internal server error!", error: error.message})
    }
}