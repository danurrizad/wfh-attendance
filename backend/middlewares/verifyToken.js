import jwt from "jsonwebtoken"

export const verifyToken = async(req, res, next) => {
    try {
        // Check if token exists
        const headersAuth = req.headers['authorization']
        const token = headersAuth && headersAuth.split(" ")[1]
        if(token === null || token === undefined){
            return res.status(401).json({ message: "Unauthorized! No token provided!"})
        }

        // Verifying token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {
            if(err){
                return res.status(401).json({ message: "Invalid or expired token!"})
            }
            req.user = user
            next()
        })

    } catch (error) {
        console.log("error: ", error)
        res.status(500).json({ message: "Internal server error!", error: error})
    }
}