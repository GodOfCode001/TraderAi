import { db } from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { sanitizeEmailInput, sanitizeInput } from '../middleWare/Sanitize.js';



export const Register = (req, res) => {
    const { username, password, email, referrer } = req.body;

    const user = sanitizeInput(username)
    const pass = sanitizeInput(password)
    const mail = sanitizeEmailInput(email)
    const refCode = sanitizeInput(referrer)

    // console.log(user + " " + pass + " " + mail + " " + refCode)

    if (!user || !pass ||!mail) {
        return res.status(400).json("Please fill in the username password and email address");
    }

    const q = "SELECT * FROM users WHERE users_username = ? OR users_email = ?";

    db.query(q, [user, mail], (err, data) => {
        if (err) return res.status(404).json(err);
        if (data.length) return res.status(409).json("Username or email is already in use, Please Login");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(pass, salt);
        
        const date = Date.now();
        const randomString = Math.random()
          .toString(36)
          .substring(2, 15)
          .toUpperCase();
        const referralCode = date + randomString;

        const insertQuery = `
        INSERT INTO users (users_username, users_password, users_email, users_referral_code) 
        VALUES (?, ?, ?, ?);
        `;

        const giveWallet = `UPDATE sub_wallet_users SET sub_owner = ? WHERE sub_owner = 0 LIMIT 1`
        
        const walletQuery = `INSERT INTO wallet (wallet_main_wallet, wallet_ref_wallet, wallet_total_topup, wallet_users_id) 
        VALUES (?, ?, ?, ?)`;

        const insertPartnerQuery = `INSERT INTO partners (PartnerID, username, Class) 
        SELECT ?, ?, ? 
        FROM users 
        WHERE users_id = ?;`;

        const selectUserWithReferral = `SELECT users.*, referrer.users_id AS referrer_id 
        FROM users 
        LEFT JOIN users AS referrer ON referrer.users_referral_code = ? 
        WHERE users.users_id = ?;`

        const queryUser = `SELECT * FROM users WHERE users_username = ?`

        db.beginTransaction(err => {
            if (err) {
                console.log("Error starting transaction:", err)
                return res.status(500).json("Internal Server Error")
            }

            db.query(insertQuery, [user, hash, mail, referralCode], (err, account) => {
                if (err) {
                    console.log("Error during Insert query:", err)
                    return db.rollback(() => res.status(500).json("Internal Server Error"))
                    // return res.status(500).json("Internal Server Error");
                }
    
                const userId = account.insertId;

                db.query(giveWallet, [userId], (err, wallet) => {
                    if (err) {
                        console.log("error during give wallet:", err)
                        return db.rollback(() => res.status(500).json("Internal Server Error"))
                    }

                    db.query(walletQuery, [0,0,0, userId], (err) => {
                        if (err) {
                            console.log("Error during wallet creation:", err)
                            return db.rollback(() => res.status(500).json("Wallet creation failed"))
                            // return res.status(500).json("Wallet creation faied");
                        }
        
                        db.query(insertPartnerQuery, [userId, user, "bronze", userId], (err) => {
                            if (err) {
                                console.log("Error during insert partner insertion:", err)
                                return db.rollback(() => res.status(500).json("Error inserting partnet"))
                                // return res.status(500).json("Error inserting partnet");
                            }
        
                            db.query(selectUserWithReferral, [refCode, userId], (err, data) => {
                                if (err) {
                                    console.log("Error during user selection:", err)
                                    return db.rollback(() => res.status(500).json("Error querying user data"))
                                    // return res.status(500).json("Error querying user data")
                                }
        
                                // console.log("data is:", data)
        
                                const refererUser = data[0]
        
                                if (refererUser && refererUser.referrer_id) {
        
                                    const insertReferrals = `
                                        INSERT INTO referrals (referrerID, referredID, Level, referral_code) 
                                        VALUES (?, ?, ?, ?);`;
        
                                    db.query(insertReferrals, [refererUser.referrer_id, userId, 1, refCode], (err) => {
                                        if (err) {
                                            console.log("Error inserting referral:", err);
                                            return db.rollback(() => res.status(500).json("Error inserting referral"))
                                        }
                                    })
                                }
        
                                db.query(queryUser, [user], (err, data) => {
                                    if (err) {
                                        console.log("error during query user data:", err)
                                        return db.rollback(() => res.status(500).json("Internal Server Error"))
                                        // return res.status(500).json("Internal Server Error")
                                    }
        
                                    const token = jwt.sign({id: data[0].users_id, userRole: data[0].users_role}, process.env.TOKEN_KEY, { expiresIn: "60m"});
        
                                    const {users_password,users_is_admin, ...other} = data[0];
                                    res.cookie("access_token", token, {
                                        httpOnly: true,
                                        secure: process.env.NODE_ENV === "production",
                                        sameSite: "Strict"
                                    }).status(200).json(other);
    
                                    db.commit(err => {
                                        if (err) {
                                            console.error("error committing transaction:", err)
                                            return db.rollback(() => res.status(500).json("Internal Server Error"));
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
    
            })
        })

    })
}

// end register

export const Login = (req, res) => {
    const { username, password } = req.body

    const sanId = sanitizeInput(username)
    const sanPass = sanitizeInput(password)

    const q = "SELECT * FROM users WHERE users_username = ?"

    db.query(q, [sanId], (err, data) => {
        if (err) return res.json(err);

        if (data.length === 0) {
            return res.status(404).json("Invalid username or password")
        }
        
        const isPasswordcorrect = bcrypt.compareSync(sanPass, data[0].users_password);

        if (!isPasswordcorrect) {
            return res.status(404).json("Invalid username or password")
        }

        if (data[0]?.users_role === "admin" || data[0]?.users_role === "ceo") {
            const  id = data[0].users_id;
            const updateUser = "UPDATE users SET users_is_admin = 1 WHERE users_id = ?"
            db.query(updateUser, [id], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json("INTERNAL ERROR");
                }
            })
        }

        const token = jwt.sign({id: data[0].users_id, userRole: data[0].users_role}, process.env.TOKEN_KEY, { expiresIn: "60m"});

        const {users_password,users_is_admin, ...other} = data[0];
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
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
