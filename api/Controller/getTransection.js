import { db } from "../db.js";
import jwt from 'jsonwebtoken'

export const adminGetTransection = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("Access token is required");
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
        if (err) return res.clearCookie("access_token", {
            sameSite: "none",
            secure: true
        }).status(408).json("token is expired, Please login again");
        const role = userInfo.userRole;

        if (role !== "admin" && role !== "ceo") {
            return res.status(403).json("Access denied from role");
        }
        
        const query = "SELECT * FROM  transactions WHERE transection_status = ?  AND transection_admin_verified = ?";
    
        const values = [
            "pending",
            0
        ]
    
        db.query(query, values, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json("internal server error");
            }
            return res.status(200).json(data)
        })
    })

}

export const ceoGetTransection = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json("Token is required");

    jwt.verify(token, process.env.TOKEN_KEY, (err, userInfo) => {
        if (err) return res.clearCookie("access_token", {
            sameSite: "none",
            secure: true
        }).status(408).json("token is expired, Please login again");

        const role = userInfo.userRole;
        if (role !== "ceo") {
            return res.status(403).json("Access denied from role");
        }

        const query = "SELECT * FROM transactions WHERE transection_status = ? AND transection_admin_verified = ? AND transection_ceo_verified = ?";
    
        const values = [
            "pending",
            1,
            0
        ]
        
        db.query(query, values, (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json("Internal server error");
            }
            return res.status(200).json(data);
        })
    })
}