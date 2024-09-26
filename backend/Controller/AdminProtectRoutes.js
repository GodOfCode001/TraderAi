import jwt from 'jsonwebtoken'

export const AdminProtect = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(403).json("Token is required")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {

        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json("Token expired")
            }
            console.log(err)
            return res.status(500).json("INTERNAL ERROR")
        }

        const role = data.userRole
        const user = data.id

        if (!role) {
            console.log("Role is required")
            return res.status(403).json("Role is required");
        }

        if (role !== "ceo" && role !== "admin") {
            console.log(`permission is not allowed : ${user}`);
            return res.status(403).json("permission is not allowed");
        }

        try { 
            if (role === "admin" || role === "ceo") {
                return res.status(200).json("OK")
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json("INTERNAL ERROR")
        }
    })
}