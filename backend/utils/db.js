import oracledb from "oracledb"
import dotenv from 'dotenv'

dotenv.config()

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0,
}

const db = {
    initializeDb: async() => {
        try {
            await oracledb.createPool(dbConfig)
            console.log("Database connection initialized...")
        } catch (error) {
            console.error("Error initialiting database connection: ", error)
        }
    },

    closeDb: async() => {
        try {
            await oracledb.getPool().close(0)
            console.log("Database connection closed...")
        } catch (error) {
            console.error("Error in closing database connection: ", error)
        }
    },
    
    execute: async(sql, binds = [], options =[]) => {
        let connection;
        try {
            connection = await oracledb.getConnection()
            const result = await connection.execute(sql, binds, {
                autoCommit: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                ...options
            })
            return result
        } catch (error) {
            console.error("Error executing query: ", error)
            throw error
        } finally{
            if(connection){
                try {
                    await connection.close()
                } catch (error) {
                    console.error("Error in closing database connection: ", error)
                }
            }
        }
    }
}

export default db

