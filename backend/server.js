import express from 'express'
import cors from 'cors'
import db from "./utils/db.js"
import rolesRouter from "./routes/Roles.js"
import usersRouter from "./routes/Users.js"
import authRouter from "./routes/Auth.js"

const app = express()
const PORT = process.env.PORT || 5000
const DATABASE = process.env.DB_CONNECTION_STRING
const USERNAME = process.env.DB_USER

app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:5091"
    ]
}))
app.use(express.json())

db.initializeDb().then(()=>{
    console.log("Database ready...")
}).catch(error=>{
    console.error("Failed to initialize database: ", error)
    process.exit(1)
})

app.get("/", (req, res) => {
    res.send("Welcome to backend API service!")
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} with database ${DATABASE} and username ${USERNAME}`);
});

app.use("/api", rolesRouter)
app.use("/api", usersRouter)
app.use("/api", authRouter)
