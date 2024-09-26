import jwt from 'jsonwebtoken'
import { db } from '../db.js';

export const depositBank = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("TOKEN  ERROR")
        }

        const q = "SELECT * FROM bank WHERE bank_isavai = 1 LIMIT 1"

        db.query(q, (err, data) => {
            if (err) {
                return res.status(404).json("Bank not found")
            }

            return res.status(200).json(data)
        })
    })
}

export const bankTopupTransactions = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(403).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("TOKEN ERROR");
        }

        const userId = data.id
        const query = "SELECT * FROM bank_topup_transactions WHERE b_maker = ? ORDER BY b_created_at DESC"

        db.query(query, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("Internal error")
            }

            if (data.length === 0) {
                return res.status(404).json("Data not found")
            }

            return res.status(200).json(data)
        })
    })
}