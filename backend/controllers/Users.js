import bcrypt from "bcrypt"
import db from "../utils/db.js"

export const getUsers = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const q = req.query.q || '';
        const offset = (page - 1) * limit;
        let binds = {}

        // Base query for counting data
        let baseQuery = `
            FROM
                USERS U
            LEFT JOIN
                ROLES R ON U.ROLE_ID = R.ID
        `;

         // Add search condition q
        let whereClause = '';
        if (q) {
             whereClause = `
                WHERE LOWER(U.NAME) LIKE '%' || LOWER(:q) || '%' 
                OR LOWER(U.EMAIL) LIKE '%' || LOWER(:q) || '%' 
                OR LOWER(U.USERNAME) LIKE '%' || LOWER(:q) || '%'
            `
            binds.q = q
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
        const foundUsers = await db.execute(`
            SELECT 
                U.ID, 
                U.NAME, 
                U.USERNAME, 
                U.EMAIL, 
                U.ROLE_ID,
                R.ROLENAME 
            ${baseQuery}
            ${whereClause}
            ORDER BY U.ID
            OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
        `,  binds );

        if (foundUsers.rows.length === 0) {
            return res.status(404).json({ message: "Data users not found!" });
        }

        res.status(200).json({ 
            message: "All users data found!", 
            data: foundUsers.rows,
            pagination: {
                page: page,
                limit: limit,
                totalPage: totalPages,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error})
    }
} 

export const getUserById = async(req, res) => {
    try {
        // Get and check params
        const { id } = req.params
        if(!id){
            return res.status(404).json({ message: "ID not found!"})
        }

        // Execute find user
        const foundUser = await db.execute("SELECT * FROM USERS WHERE ID = :id", { id: id })

        // If no user found
        if(foundUser.rows.length === 0){
            return res.status(404).json({ message: "User not found!"})
        }

        res.status(200).json({ message: "User found!", data: foundUser.rows})
    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error})
    }
} 

export const createUser = async(req, res) => {
    try {
        // Get and check request body
        const { name, username, email, password, passwordConfirmation, roleId } = req.body
        if(!name || !username || !email || !password ||!passwordConfirmation || !roleId){
            return res.status(400).json({ message: "Please fill all required fields!"})
        }

        // Check if user already exist
        const existingUsername = await db.execute(
            "SELECT ID FROM USERS WHERE username = :username", 
            { username: username }
        )
        if(existingUsername.rows.length > 0){
            return res.status(400).json({ message: "Username already exists!"})
        }
        const existingEmail = await db.execute(
            "SELECT ID FROM USERS WHERE email = :email",
            { email: email }
        )
        if(existingEmail.rows.length > 0){
            return res.status(400).json({ message: "Email already exists!"})
        }

        // Check if role exist
        const foundRole = await db.execute("SELECT ROLENAME FROM ROLES WHERE id = :role_id", { role_id: roleId })
        if(foundRole.rows.length === 0){
            return res.status(404).json({ message: "Role invalid!"})
        }
        if(password !== passwordConfirmation){
            return res.status(400).json({ message: "Password doesn't match!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        await db.execute(
            "INSERT INTO USERS (name, username, email, password, role_id) VALUES (:name, :username, :email, :password, :role_id)",
            { 
                name: name, 
                username: username, 
                email: email, 
                password: hashedPassword, 
                role_id: roleId,
            }
        )
        res.status(201).json({ message: "User registered successfully!"})

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error!", error: error})
    }
}

export const updateUserById = async(req, res) => {
    try {
        // Get and check params and body
        const { id } = req.params
        const { name, roleId } = req.body
        if(!id){
            return res.status(404).json({ message: "ID not found!" })
        }
        if(!name && !roleId){
            return res.status(400),json({ message: "Please fill at least 1 field to update!"})
        }

        // Set default query
        let sql = `UPDATE USERS SET ` 
        const updatedFields = []
        const binds = { id: id }

        // Add into query if name and/or role_id exist
        if(name){
            updatedFields.push("NAME = :name") 
            binds.name = name 
        }
        if(roleId){
            updatedFields.push("ROLE_ID = :role_id")
            binds.role_id = roleId
        }
        sql += updatedFields.join(", ") + ` WHERE ID = :id`
        console.log("sql: ", sql)


        // Check if user exists
        const foundUser = await db.execute("SELECT ID, NAME, ROLE_ID FROM USERS WHERE ID = :id ", { id: id })
        if(foundUser.rows.length === 0){
            return res.status(404).json({ message: "User not found!"})
        }

        // Check if there is no changes from body to current
        if(foundUser.rows[0].NAME === name && foundUser.rows[0].ROLE_ID === roleId){
            return res.status(400).json({ message: "Can't update data with same value!"})
        }

        // Execute update user
        const updatedUser = await db.execute(sql, binds)
        if(updatedUser.rowsAffected.length === 0){
            return res.status(400).json({ message: "Update failed!"})
        }

        res.status(200).json({ message: "User updated!"})
    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error})
    }
}

export const deleteUserById = async(req, res) => {
    try {
        // Get and check params
        const { id } = req.params
        if(!id){
            return res.status(404).json({ message: "ID not found!"})
        }
        const foundUser = await db.execute("SELECT ID, NAME FROM USERS WHERE ID = :id", { id: id })
        if(foundUser.rows.length === 0){
            return res.status(404).json({ message: "User not found!"})
        }
        const deletedUser = await db.execute("DELETE FROM USERS WHERE ID = :id", { id: id })
        if(deletedUser.rowsAffected.length === 0){
            return res.status(400).json({ message: "Delete failed!"})
        }
        res.status(200).json({ message: "User deleted!"})
    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error})
    }
}