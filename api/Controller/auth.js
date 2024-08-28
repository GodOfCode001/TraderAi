import { db } from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const Register = (req, res) => {
    const { username, password, email, referrer } = req.body;

    if (!username || !password ||!email) {
        return res.status(411).json("Please fill in the username password and email address");
    }

    const q = "SELECT * FROM users WHERE users_username = ? AND users_email = ?";

    db.query(q, [username, email], (err, data) => {
        if (err) return res.status(404).json("ERROR:", err);
        if (data.length) return res.status(409).json("User exists already, Please Login");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        
        const date = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15).toUpperCase()
        const referralCode = date + randomString
    
        const insertQuery = "INSERT INTO users (`users_username`, `users_password`, `users_email`, `users_referral_code`) VALUES (?)"
        const values = [
            username,
            hash,
            email,
            referralCode
        ]

        db.query(insertQuery, [values], (err, account) => {
            if (err) {
                console.error("Error during INSERT query:", err);
                return res.status(500).json("Internal Server error");
            }  

            const userId = account.insertId;

            const createWallet = "INSERT INTO wallet (`wallet_main_wallet`, `wallet_ref_wallet`, `wallet_total_topup`, `wallet_users_id`) VALUES (?)" 

            const wallet = [
                0,
                0,
                0,
                userId
            ]

            db.query(createWallet, [wallet], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json("Wallet creating failed:", err)
                }

                const queryUser = "SELECT * FROM users WHERE users_id = ?"

                db.query(queryUser, userId, (err, data) => {
                    if (err) {
                        console.log("Error query datauser for partner")
                        return res.status(500).json("Error query datauser for partner")
                    }

                    const my_info = data[0];

                    const insertPartner = "INSERT INTO partners (`PartnerID`, `username`, `Class`) VALUES (?)"
    
                    const partner = [
                        userId,
                        my_info.users_username,
                        my_info.users_class
                    ]

                    db.query(insertPartner, [partner], (err, data) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json("Error insert partner")
                        }



                        if (referrer) {
                            const queryUser = "SELECT * FROM users WHERE users_referral_code = ?"
                    
                            db.query(queryUser, referrer, (err, referrerUser) => {
                                if (err || !referrerUser.length) {
                                    console.log("error is", err || "Referrer not found");
                                } else {
        
                                    const {  password, ...other } = referrerUser[0];
        
                                    const insertReferrals = "INSERT INTO referrals (`referrerID`, `referredID`, `Level`, `referral_code`) VALUES (?)"
                        
                                    const refInsert = [
                                        other.users_id,
                                        userId,
                                        1,
                                        referrer
                                    ]
        
                                    db.query(insertReferrals, [refInsert], (err,  data) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                    })
                                }
                            })
                        }
                    })
                })

                return res.status(201).json("Register successfully")

            })
        })
    })
}

// end register

export const Login = (req, res) => {
    const q = "SELECT * FROM users WHERE users_username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found, Please register or try again");

        const isPasswordcorrect = bcrypt.compareSync(req.body.password, data[0].users_password);

        if (!isPasswordcorrect) return res.status(404).json("Password incorrect,Please try again");

        const token = jwt.sign({id: data[0].users_id, userRole: data[0].users_role}, process.env.TOKEN_KEY, { expiresIn: "1h"});

        const {users_password, ...other} = data[0];
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other)
    })
}

// end Login

export const Logout = (req, res) => {
    const { userId } = req.body;
    console.log("logout user", userId)

    // ลบ cookies ของ access_token
    res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "none",
        secure: true
    }).status(200).json("User has been logged out");

    // res.clearCookie("access_token", {
    //     sameSite: "none",
    //     secure: true
    // }).status(200).json("User has been logged out")
}
