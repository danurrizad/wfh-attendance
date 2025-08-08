import bcrypt from "bcrypt"
import db from "../utils/db.js"

export const getUsers = async(req, res) => {
    try {
        // Execute find Users join Role roleName
        const foundUsers = await db.execute(`
            SELECT 
                U.ID, 
                U.NAME, 
                U.USERNAME, 
                U.EMAIL, 
                U.ROLE_ID,
                R.ROLENAME 
            FROM 
                USERS U 
            LEFT JOIN 
                ROLES R ON U.ROLE_ID = R.ID
            ORDER BY
                U.ID
        `)

        // If no users found
        if(foundUsers.rows.length === 0){
            return res.status(404).json({ message: "Users not found!"})
        }
        
        res.status(200).json({ message: "All users found!", data: foundUsers.rows})
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
        const { name, username, email, password, role_id } = req.body
        if(!name || !username || !email || !password || !role_id){
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
        const foundRole = await db.execute("SELECT ROLENAME FROM ROLES WHERE id = :role_id", { role_id: role_id })
        if(foundRole.rows.length === 0){
            return res.status(404).json({ message: "Role invalid!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        await db.execute(
            "INSERT INTO USERS (name, username, email, password, role_id) VALUES (:name, :username, :email, :password, :role_id)",
            { 
                name: name, 
                username: username, 
                email: email, 
                password: hashedPassword, 
                role_id: role_id,
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
        const { name, role_id } = req.body
        if(!id){
            return res.status(404).json({ message: "ID not found!" })
        }
        if(!name && !role_id){
            return res.status(400),json({ message: "Please fill at least 1 field to update!"})
        }

        // Set default query
        let sql = `UPDATE USERS SET` 
        const updatedFields = []
        const binds = { id: id}

        // Add into query if name and/or role_id exist
        if(name){
            updatedFields.push("NAME = :name") 
            binds.name = name 
        }
        if(role_id){
            updatedFields.push("ROLE_ID = :role_id")
            binds.role_id = role_id
        }
        sql += updatedFields.join(", ") + `WHERE ID = :id`


        // Check if user exists
        const foundUser = await db.execute("SELECT ID, NAME FROM USERS WHERE ID = :id ", { id: id })
        if(foundUser.rows.length === 0){
            return res.status(404).json({ message: "User not found!"})
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