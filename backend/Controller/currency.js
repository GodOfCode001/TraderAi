import jwt from 'jsonwebtoken'
import { db } from '../db.js'

export const getTHBRate = (req, res) => {
    const token = req.cookies.access_token
    const cat = req.query.cat

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("Token error:", err)
            return res.status(403).json("Token error")
        }

        const queryRate = 'SELECT * FROM currency_rate WHERE currency_name = ?'

        db.query(queryRate, [cat], (err, data) => {
            if (err) {
                console.log("error while fetching currecy rate:", err)
                return res.status(500).json('rate not found')
            }

            if (data.length === 0) {
                return res.status(404).json("currency rate not found")
            }

            return res.status(200).json(data)
        })
    })
}