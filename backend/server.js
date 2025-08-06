import express from 'express'
import cors from 'cors'
import db from "./utils/db.js"

const app = express()
const PORT = process.env.PORT || 5000
const { initializeDb, closeDb, execute } = db()

app.use(cors())
app.use(express.json())

initializeDb().then(()=>{
    console.log("Database ready...")
}).catch(error=>{
    console.error("Failed to initialize database: ", error)
    process.exit(1)
})

app.get("/", (req, res) => {
    res.send("Welcome to backend API service!")
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
