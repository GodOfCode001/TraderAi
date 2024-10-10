import jwt from "jsonwebtoken"
import { db } from "../db.js"

export const getTransactionHistory = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("token error:", err)
            return res.status(403).json("Token error")
        }

        const userId = data.id
        const limit = parseInt(req.query.limit) || 10; 
        const page = parseInt(req.query.page) || 1; 
        const offset = (page - 1) * limit; 

        const query = `SELECT * FROM all_transactions WHERE AT_maker = ? ORDER BY AT_date_time DESC LIMIT ? OFFSET ?`

        db.query(query, [userId, limit, offset], (err, data) => {
            if (err) {
                console.log("error while query tranasctions history:", err)
                return res.status(500).json("internal error")
            }

            if (data.length === 0) {
                return res.status(404).json("Data not found")
            }

            return res.status(200).json(data)
        })
    })
}