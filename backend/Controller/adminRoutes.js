import jwt from "jsonwebtoken"
import { db } from "../db.js"
import { sanitizeEmailInput, sanitizeInput } from "../middleWare/Sanitize.js"
import bcrypt from 'bcrypt'

export const getUsers = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        console.log("no admin token")
        return res.status(403).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("token error admin get users:", err)
            return res.status(403).json("not authenticated")
        }

        const userId = data.id
        const cookiesRole = data.userRole

        const query = "SELECT users_role FROM users WHERE users_id = ?"

        const queryUsers = `SELECT users_id, users_username, users_email, users_role, users_class,
                            users_gender, users_country FROM users WHERE users_role != 'ceo'`

        db.query(query, [userId], (err, data) => {
            if (err) {
                console.log("error while checking admin role:", err)
                return res.status(500).json("internal error")
            }

            const DBrole = data[0].users_role

            if (cookiesRole !== DBrole) {
                console.log("role not matched")
                return res.status(403).json("not authenticated")
            }

            db.query(queryUsers, (err, data) => {
                if (err) {
                    console.log("error while query all users:", err)
                    return res.status(500).json("internal error")
                }

                const { users_password, ...other } = data[0]

                return res.status(200).json(data)
            })
        })
    })
}

export const getUsersChart = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("admin not authenticated:", err)
            return res.status(403).json("not authenticated")
        }

        const query = "SELECT MONTH(users_created_at) AS month, COUNT(*) AS user_count FROM users GROUP BY MONTH(users_created_at)";

        db.query(query, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    })
}

export const changeRole = (req, res) => {
    const token = req.cookies.access_token
    const { changedRole, changedId } = req.body

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("admin not authenticated:", err)
            return res.status(403).json("not authenticated")
        }

        const userId = data.id
        const cookiesRole = data.userRole

        const checkQuery = "SELECT users_role FROM users WHERE users_id = ?"

        const updateQuery = "UPDATE users SET users_role = ? WHERE users_id = ?"

        db.query(checkQuery, [userId], (err, data) => {
            if (err) {
                console.log("error while checking admin role:", err)
                return res.status(500).json("internal error")
            }

            const dbRole = data[0].users_role

            if (cookiesRole !== dbRole) {
                return res.status(403).json("Not authenticated")
            }

            db.query(updateQuery, [changedRole, changedId], (err ,data) => {
                if (err) {
                    console.log("error while updating users roleJ:", err)
                    return res.status(500).json("internal error")
                }

                 return res.status(200).json("Update role successfully")
            })
        })
    })
}

export const addNewUser = (req, res) => {
    const { username, password, email, referrer } = req.body;

    const user = sanitizeInput(username)
    const pass = sanitizeInput(password)
    const mail = sanitizeEmailInput(email)
    const refCode = sanitizeInput(referrer)


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
    
                                    db.commit(err => {
                                        if (err) {
                                            console.error("error committing transaction:", err)
                                            return db.rollback(() => res.status(500).json("Internal Server Error"));
                                        }

                                        return res.status(200).json("User has been created")
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

export const getCryptoTransactions = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("admin not authenticated:", err)
            return res.status(403).json("not authenticated")
        }

        const checkQuery = "SELECT users_role FROM users WHERE users_id = ?"
        const queryTransactions = "SELECT * FROM all_transactions WHERE AT_status = 'pending'"

        const userId = data.id
        const cookieRole = data.userRole

        db.query(checkQuery, [userId], (err, data) => {
            if (err) {
                console.log("error while checking admin role:", err)
                return res.status(403).json("token error")
            }

            const dbRole = data[0].users_role

            if (cookieRole !== dbRole) {
                return res.status(403).json("not authenticated")
            }

            db.query(queryTransactions, (err, data) => {
                if (err) {
                    console.log("error while query admin transactions:", err)
                    return res.status(500).json("internal error")
                }

                return res.status(200).json(data)
            })
        })
    })
}

// export const adminDenied = (req, res) => {
//     const token = req.cookies.access_token
//     const { transactionsId, id, remark, principal, profit, amount, maker } = req.body

//     if (!token) {
//         return res.status(401).json("NOTOK")
//     }

//     jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
//         if (err) {
//             console.log("admin not authenticated:", err)
//             return res.status(403).json("not authenticated")
//         }

//         const userId = data.id
//         const role = data.userRole

//         if (role !== "admin" && role !== "ceo") {
//             return res.status(403).json("Acess denied")
//         }

//         const query = remark 
//         ? "UPDATE all_transactions SET AT_status = 'denied', AT_remark = ? WHERE AT_id = ?" 
//         : "UPDATE all_transactions SET AT_status = 'denied' WHERE AT_id = ?";



//         const updateWallet = principal 
//         ? "UPDATE wallet SET wallet_waiting_transfer = wallet_waiting_transfer - ?, wallet_main_wallet = wallet_main_wallet + ?, wallet_freeze = wallet_freeze - ?, wallet_principal = wallet_principal + ? WHERE wallet_users_id ?"
//         : profit 
//         ? "UPDATE wallet SET wallet_waiting_transfer = wallet_waiting_transfer - ?, wallet_main_wallet = wallet_main_wallet + ?, wallet_freeze = wallet_freeze - ?, wallet_profit = wallet_prorfit + ? WHERE wallet_users_id ?" 
//         : "UPDATE wallet SET wallet_waiting_transfer = wallet_waiting_transfer - ?, wallet_main_wallet = wallet_main_wallet + ?, wallet_freeze = wallet_freeze - ?, wallet_profit = wallet_prorfit + ? WHERE wallet_users_id ?"

//         const adminVerifyQuery = "UPDATE transactions SET transection_admin_verified = 1 WHERE transection_tsx_id = ?"

//         const queryTrans = "SELECT Amount,transection_is_profit,transection_is_principal,transection_is_both FROM transactions WHERE transection_tsx_id = ?"

//         const queryValue = remark 
//         ? [remark, id]
//         : [id]

//         const updateWalletValues = [

//         ]
//         db.query(query, queryValue, (err, data) => {
//             if (err) {
//                 console.log("error while update success:", err)
//                 return res.status(500).json("internal error")
//             }

//             db.query(adminVerifyQuery, [transactionsId], (err, data) => {
//                 if (err) {
//                     console.log("error while update admin verify:", err)
//                     return res.status(500).json("internal error")
//                 }

//                 return res.status(200).json("Confirmed")
//             })
//         })
//     })
// }

export const adminDenied = async (req, res) => {
    const token = req.cookies.access_token;
    const { transactionsId, id, remark, principal, profit, both, amount, maker } = req.body;
  
    if (!token) {
      return res.status(401).json("NOTOK");
    }
  
    // Verify the token to make sure user is authenticated
    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
      if (err) {
        console.log("admin not authenticated:", err);
        return res.status(403).json("not authenticated");
      }
  
      const userId = data.id;
      const role = data.userRole;
  
      if (role !== "admin" && role !== "ceo") {
        return res.status(403).json("Access denied");
      }
  
      // Query to update the transaction status
      const query = remark
        ? "UPDATE all_transactions SET AT_status = 'denied', AT_remark = ? WHERE AT_id = ?"
        : "UPDATE all_transactions SET AT_status = 'denied' WHERE AT_id = ?";
  
      const queryValue = remark ? [remark, id] : [id];
  
      db.query(query, queryValue, (err, result) => {
        if (err) {
          console.log("Error updating transaction status:", err);
          return res.status(500).json("Internal error");
        }
  
        // Update wallet based on the type of transaction (principal, profit, or both)
        let updateWallet;
        let updateWalletValues;
  
        if (principal === 1) {
          updateWallet = `
            UPDATE wallet SET 
              wallet_waiting_transfer = wallet_waiting_transfer - ?, 
              wallet_main_wallet = wallet_main_wallet + ?, 
              wallet_freeze = wallet_freeze - ?, 
              wallet_principal = wallet_principal + ? 
            WHERE wallet_users_id = ?`;
          updateWalletValues = [amount, amount, amount, amount, userId];
        } else if (profit === 1) {
          updateWallet = `
            UPDATE wallet SET 
              wallet_waiting_transfer = wallet_waiting_transfer - ?, 
              wallet_main_wallet = wallet_main_wallet + ?, 
              wallet_freeze = wallet_freeze - ?, 
              wallet_profit = wallet_profit + ? 
            WHERE wallet_users_id = ?`;
          updateWalletValues = [amount, amount, amount, amount, userId];
        } else if (both === 1) {
          updateWallet = `
            UPDATE wallet SET 
              wallet_waiting_transfer = wallet_waiting_transfer - ?, 
              wallet_main_wallet = wallet_main_wallet + ?, 
              wallet_freeze = wallet_freeze - ?, 
              wallet_principal = wallet_principal + ?, 
              wallet_profit = wallet_profit + ? 
            WHERE wallet_users_id = ?`;
          updateWalletValues = [amount, amount, amount, amount / 2, amount / 2, userId];
        } else {
          return res.status(400).json("Invalid transaction type");
        }
  
        db.query(updateWallet, updateWalletValues, (err, result) => {
          if (err) {
            console.log("Error updating wallet:", err);
            return res.status(500).json("Internal error");
          }
  
          // Mark transaction as verified by admin
          const adminVerifyQuery = "UPDATE transactions SET transection_admin_verified = 1 WHERE transection_tsx_id = ?";
          db.query(adminVerifyQuery, [transactionsId], (err, result) => {
            if (err) {
              console.log("Error while updating admin verification:", err);
              return res.status(500).json("Internal error");
            }
  
            // Send success response
            return res.status(200).json("Transaction denied and wallet updated successfully.");
          });
        });
      });
    });
  };

export const adminConfirm = (req, res) => {
    const token = req.cookies.access_token
    const { transactionsId, id, remark } = req.body

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("admin not authenticated:", err)
            return res.status(403).json("not authenticated")
        }

        const userId = data.id
        const role = data.userRole

        if (role !== "admin" && role !== "ceo") {
            return res.status(403).json("Acess denied")
        }

        const query = remark 
        ? "UPDATE all_transactions SET AT_status = 'success', AT_remark = ? WHERE AT_id = ?" 
        : "UPDATE all_transactions SET AT_status = 'success' WHERE AT_id = ?";

        const queryValue = remark 
        ? [remark, id]
        : [id]

        const adminVerifyQuery = "UPDATE transactions SET transection_admin_verified = 1 WHERE transection_tsx_id = ?"

        db.query(query, queryValue, (err, data) => {
            if (err) {
                console.log("error while update success:", err)
                return res.status(500).json("internal error")
            }

            db.query(adminVerifyQuery, [transactionsId], (err, data) => {
                if (err) {
                    console.log("error while update admin verify:", err)
                    return res.status(500).json("internal error")
                }

                return res.status(200).json("Confirmed")
            })
        })
    })
}