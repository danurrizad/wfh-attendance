import db from "../utils/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const login = async(req, res) => {
    try {
        // Get and check request body
        const { username, password } = req.body
        if(!username || !password){
            res.status(400).json({ message: "Please fill all required fields!"})
        }

        // Check if username is registered
        const foundUser = await db.execute(`
            SELECT 
                U.ID,
                U.NAME,
                U.USERNAME,
                U.EMAIL,
                U.PASSWORD,
                U.ROLE_ID,
                R.ROLENAME
            FROM 
                USERS U 
            LEFT JOIN 
                ROLES R ON R.ID = U.ROLE_ID
            WHERE 
                USERNAME = :username
            `, { username: username })
        if(foundUser.rows.length === 0){
            return res.status(401).json({ message: "Invalid username or password!"})
        }

        // Check encrypted user password
        const user = foundUser.rows[0]
        const isValidated = await bcrypt.compare(password, user.PASSWORD)
        if(!isValidated){
            return res.status(401).json({ message: "Invalid username or password!"})
        }

        // If validated
        const accessToken = jwt.sign(
            {
                userId: user.ID,
                name: user.NAME,
                username: user.USERNAME,
                email: user.EMAIL,
                role_id: user.ROLE_ID,
                rolename: user.ROLENAME,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        )

        const refreshToken = jwt.sign(
            {
                userId: user.ID,
                name: user.NAME,
                username: user.USERNAME,
                email: user.EMAIL,
                role_id: user.ROLE_ID,
                rolename: user.ROLENAME,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '12h' }
        )
        db.execute("UPDATE USERS SET REFRESH_TOKEN = :refreshToken WHERE ID = :id", {
            refreshToken: refreshToken,
            id: user.ID
        })

        res.status(200).json({ message: `Welcome, ${user.NAME}`, accessToken, refreshToken, roleName: user.ROLENAME})
    } catch (error) {
        console.error("ERROR: ", error)
        res.status(500).json({ message: "Internal server error!", error: error})
    }
}

export const logout = async(req, res) => {
    try {
        res.status(200).json({ message: "Logout successful!"})
    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error})
    }
}

export const refreshToken = async(req, res) => {
    try {
        // Get and check request body
        const { refreshToken } = req.body
        if(!refreshToken){
            return res.status(401).json({ message: "Unauthorized! No token provided."})
        }

        // Check user with valid refresh token
        const foundUser = await db.execute(`
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
                ROLES R ON R.ID = U.ROLE_ID
            WHERE 
                REFRESH_TOKEN = :refreshToken
                `, {
                    refreshToken: refreshToken
                })
        if(foundUser.rows.length === 0){
            return res.status(401).json({ message: "Unauthorized! Token expired or invalid!" })
        }

        // Sign a new refresh token to user
        const newRefreshToken = jwt.sign(
            {
                userId: foundUser.ID,
                name: foundUser.NAME,
                username: foundUser.USERNAME,
                email: foundUser.EMAIL,
                role_id: foundUser.ROLE_ID,
                rolename: foundUser.ROLENAME,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '12h' }
        )
        db.execute("UPDATE USERS SET REFRESH_TOKEN = :newRefreshToken WHERE ID = :id", {
            newRefreshToken: newRefreshToken,
            id: foundUser.ID
        })
        
        res.status(200).json({ message: "Token refreshed!", refreshToken: newRefreshToken})

    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error?.message})
    }
}