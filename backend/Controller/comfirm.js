import jwt from 'jsonwebtoken'
import { db } from '../db.js';

export const adminConfirm = (req ,res) => {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Acess token is required");

    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
        if (err) return res.clearCookie("access_token", {
            sameSite: "none",
            secure: true
        }).status(408).json("token expired, Please login again");
        const role = userInfo.userRole;
        if (role !== "admin" && role !== "ceo") {
            return res.status(403).json("Access denied");
        }
    })

    const { transectionId, userRole } = req.body

    if (userRole !== "admin" && userRole !== "ceo") {
        return res.status(403).json("Access denied")
    }

    const query = "UPDATE transactions SET transection_admin_verified = ? WHERE transactionID = ?"

    const values = [
        1,
        transectionId
    ]
    db.query(query, values, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json("Internal server error");
        }
        return res.status(200).json("verify successfully")
    })
}

export const ceoConfirm = (req, res) => {
    const token = req.cookies.access_token

    if (!token) return res.status(401).json("Acess token is required");

    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
        if (err) return res.clearCookie("access_token", {
            sameSite: "none",
            secure: true
        }).status(408).json("token expired, Please login again");
        const role = userInfo.userRole;
        if (role !== "ceo") {
            return res.status(403).json("Access denied");
        }
    })

    const { transectionId, userRole } = req.body

    if (userRole !== "ceo") {
        return res.status(403).json("Access denied");
    }

    const query = "UPDATE transactions SET transection_ceo_verified = ? WHERE transactionID = ?"

    const values = [
        1,
        transectionId
    ]

    db.query(query, values, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).json("Internal server error");
        }
        return res.status(200).json("ceo verify successful");
    })
}