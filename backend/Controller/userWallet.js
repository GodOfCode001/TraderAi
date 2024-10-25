import { db } from "../db.js";
import jwt from 'jsonwebtoken'
import { sanitizeInput } from "../middleWare/Sanitize.js";

const generateTransactionId = () => {
    return 'txn_' + Date.now() +  Math.random().toString(36).substr(2, 9)
}

export const queryCommission = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("token error", err)
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const checkComDistributed = "SELECT cmd.* FROM commissiondistribution cmd LEFT JOIN users u ON cmd.class = u.users_class WHERE u.users_id = ?"

        db.query(checkComDistributed, [userId], (err, data) => {
            if (err) {
                console.log("error while query ComDistributed:", err)
                return res.status(500).json("internal error")
            }

            // console.log(data)

            return res.status(200).json(data)
        })
    })
}

export const getWallet = (req, res) => {

    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const queryWallet = `SELECT user_bank_wallet.UBW_account,
        user_bank_wallet.UBW_bank_account_name,
        user_bank_wallet.UBW_bank_name,
        wallet.wallet_main_wallet,
        wallet.wallet_freeze,
        wallet.wallet_profit,
        wallet.wallet_principal
        FROM user_bank_wallet
        INNER JOIN
        wallet
        ON
        user_bank_wallet.UBW_owner = wallet.wallet_users_id 
        WHERE user_bank_wallet.UBW_owner = ?`
    
        db.query(queryWallet, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            if (data.length === 0) {
                return res.status(404).json("data not found")
            }

            // console.log(data)
            return res.status(200).json(data)
        })
    })
}

export const queryMainWallet = (req, res) => {
    const token = req.cookies.access_token

    if (!token) return res.status(401).json("NOTOK")

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("token error")
            return res.status(403).json("token error")
        }

        const userId = data.id

        const query = `SELECT u.wallet_main_wallet, cr.currency_rate
                        FROM wallet u
                        LEFT JOIN currency_rate cr ON cr.currency_name = 'D2B'
                        WHERE u.wallet_users_id = ?;`

        db.query(query, [userId], (err, data) => {
            if (err) {
                console.log("error while query user main wallet:", err)
                return res.status(500).json("internal error")
            }

            return res.status(200).json(data)
        })
    })
}
 
export const withdrawRequest = (req, res) => {
    const token = req.cookies.access_token;
    const { amount, userHave, includedPrincipal } = req.body

    if (!amount || !userHave) {
        console.log("Here 1")
        return res.status(404).json("please fill amount of withdraw")
    }

    const sanAmount = sanitizeInput(amount)
    const sanUserHave = sanitizeInput(userHave)
    console.log(sanUserHave)

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const tranId = generateTransactionId()

        const queryAddress = `SELECT a.UCW_address, a.UCW_chain, w.wallet_principal, w.wallet_profit FROM user_crypto_wallet a JOIN wallet w ON a.UCW_owner = w.wallet_users_id WHERE w.wallet_users_id = ?`

        const checkUserQuery = "SELECT * FROM users WHERE users_id = ?"

        const CheckIsExists = `SELECT COUNT(*) AS count FROM all_transactions WHERE AT_transactions_hash = ?` 
                            
        const insertWithdrawRequest = "INSERT INTO all_transactions (  `AT_transactions_hash`,  `AT_to`,  `AT_value`,  `AT_token_name`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_principal`, `AT_crypto_chain`, `AT_user_address`) VALUES (?)"

        const insertWithdrawRequestBoth = "INSERT INTO all_transactions (  `AT_transactions_hash`,  `AT_to`,  `AT_value`,  `AT_token_name`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_both`, `AT_crypto_chain`, `AT_user_address`) VALUES (?)"

        const insertWithdrawRequestProfit = "INSERT INTO all_transactions (`AT_transactions_hash`, `AT_to`, `AT_value`, `AT_token_name`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_profit`, `AT_crypto_chain`, `AT_user_address`) VALUES (?)"

        const checkComDistributed = "SELECT cmd.* FROM commissiondistribution cmd LEFT JOIN users u ON cmd.class = u.users_class WHERE u.users_id = ?"

        const queryCommission = `WITH RECURSIVE commission_hierarchy AS (
                                SELECT 
                                    r.referredID, 
                                    r.referrerID, 
                                    cc.Level1Commission, 
                                    cc.Level2Commission, 
                                    cc.Level3Commission, 
                                    1 AS level
                                FROM referrals r
                                JOIN users u ON r.referrerID = u.users_id
                                JOIN Commissionclasses cc ON u.users_class = cc.class
                                WHERE r.referredID = ?
                                
                                UNION ALL
                                
                                SELECT 
                                    ch.referredID,
                                    r.referrerID, 
                                    cc.Level1Commission, 
                                    cc.Level2Commission, 
                                    cc.Level3Commission, 
                                    ch.level + 1
                                FROM commission_hierarchy ch
                                JOIN referrals r ON ch.referrerID = r.referredID
                                JOIN users u ON r.referrerID = u.users_id
                                JOIN CommissionClasses cc ON u.users_class = cc.class
                                WHERE ch.level < 3
                                )
                                SELECT * FROM commission_hierarchy ORDER BY level;`

        const freezeQuery = "UPDATE wallet SET wallet_waiting_transfer = ?, wallet_main_wallet = wallet_main_wallet - ?, wallet_freeze = wallet_freeze + ?, wallet_profit = wallet_profit - ? WHERE wallet_users_id = ?"

        const checkTransactionsExists = "SELECT COUNT(*) AS count FROM transactions WHERE transection_tsx_id = ?"

        const insertQuery = "INSERT INTO transactions SET ?"

        const checkQuota = "SELECT wallet_remaining FROM wallet WHERE wallet_users_id  = ?"

        const updateQuota = "UPDATE wallet SET wallet_remaining = wallet_remaining - 1 WHERE wallet_users_id = ?"

        const queryCurrentRate = `SELECT currency_rate FROM currency_rate WHERE currency_name = "B2D"`

        db.beginTransaction(err => {
            if (err) {
                console.log("error while beginTransaction:", err)
                return db.rollback(() => res.status(500).json("internal error"))
            }


            if (includedPrincipal === 1) {
                // console.log("in")

                db.query(queryCurrentRate, (err, data) => {
                    if (err) {
                        console.log("error while query curreny rate:", err)
                    }

                    const rate = data[0].currency_rate

                    db.query(checkQuota, [userId], (err, data) => {
                        if (err) {
                            console.log("error while checking quota", err)
                            return db.rollback(() => res.status(500).json("internal error"))
                        }
    
                        const quota = data[0].wallet_remaining
    
                        if (quota <= 0) {
                            console.log("error quota limit exceeded")
                            return db.rollback(() => res.status(403).json("Withdraw quota not enough"))
                        }
    
                        db.query(updateQuota, [userId], (err, data) => {
                            if (err) {
                                console.log("error while updating quota:", err)
                                return db.rollback(() => res.status(500).json("internal error"))
                            }
    
                            db.query(queryAddress, [userId], (err, data) => {
                                if (err) {
                                    console.log("error while querying address:", err)
                                    return db.rollback(() => res.status(500).json("internal error"))
                                }
    
                                const addressData = data[0].UCW_address
                                const chain = data[0].UCW_chain
                                const principal = data[0].wallet_principal
                                const profit = data[0].wallet_profit
    
                                const totalPrincipal = sanAmount - profit
                                const totalProfit = sanAmount - totalPrincipal
                                console.log("totalprofit is:", totalProfit)
                                // const totalUserHave =  
    
                                db.query(checkUserQuery, [userId], (err,data) => {
                                    if (err) {
                                        console.log("error while checking user:", err)
                                        return db.rollback(() => res.status(500).json("internal error"))
                                    }
    
                                    const userClass = data[0].users_class
    
                                    db.query(checkComDistributed, [userId], (err, data) => {
                                        if (err) {
                                            console.log("error while distributing:", err)
                                            return db.rollback(() => res.status(500).json("internal error"))
                                        }
    
                                        const userDistributed = data[0]
                                        const userHavePercentage = userDistributed.PartnerSharePercentage
                                        const companyPercentage = userDistributed.CompanySharePercentage
    
                                        let totalReferrerShare = 0;
    
                                        db.query(queryCommission, [userId], (err, data) => {
                                            if (err) {
                                                console.log("error while query commission:", err)
                                                return db.rollback(() => res.status(500).json("internal error"))
                                            }
    
                                            const referers = data
    
                                            const referrerShares = referers.map(ref => {
                                                const share = sanAmount * (ref[`Level${ref.level}Commission`] / 100)
                                                totalReferrerShare += share
    
                                                return {
                                                    referrerId: ref.referrerID,
                                                    commission: share,
                                                    level: ref.level
                                                }
                                            })
    
                                            db.query(freezeQuery, [sanAmount, sanAmount,sanAmount, totalProfit, userId], (err, data) => {
                                                if (err) {
                                                    console.log("error while freeze for waiting transfer:", err)
                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                }
    
                                                const totalPartnerShareOnlyProfit = profit * (userHavePercentage / 100)
                                                const CompanyShare = profit * (companyPercentage / 100)
                                                const totalCompanyShare = CompanyShare - totalReferrerShare
    
                                                db.query(CheckIsExists, [tranId], (err, data) => {
                                                    if (err) {
                                                        return db.rollback(() => res.status(500).json("internal error"))
                                                    }
                    
                                                    const count = data[0].count
                    
                                                    if (count === 0) {
    
                                                        if (includedPrincipal === 1 && profit > 0) {
                                                            const insertValues = [
                                                                tranId,
                                                                addressData,
                                                                sanAmount,
                                                                "ThaiBath",
                                                                userId,
                                                                "BATH",
                                                                sanUserHave,
                                                                sanAmount,
                                                                "bank_withdraw",
                                                                1,
                                                                "",
                                                                addressData
                                                            ]
        
        
                                                            db.query(insertWithdrawRequestBoth, [insertValues], (err, data) => {
                                                                if (err) {
                                                                    console.log("error while inserting data to all_transactions both:", err)
                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                }
    
    
                                                            })
                                                        } else if (includedPrincipal === 1 && profit === 0) {
    
                                                            const insertValues = [
                                                                tranId,
                                                                addressData,
                                                                sanAmount,
                                                                "ThaiBath",
                                                                userId,
                                                                "BATH",
                                                                sanUserHave,
                                                                sanAmount,
                                                                "bank_withdraw",
                                                                1,
                                                                "",
                                                                addressData
                                                            ]
        
        
                                                            db.query(insertWithdrawRequest, [insertValues], (err, data) => {
                                                                if (err) {
                                                                    console.log("error while inserting data to all_transactions onlyprincipal:", err)
                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                }
    
                                                            })
                                                        } else {
                                                            const insertValues = [
                                                                tranId,
                                                                addressData,
                                                                sanAmount,
                                                                "ThaiBath",
                                                                userId,
                                                                "BATH",
                                                                sanUserHave,
                                                                sanAmount,
                                                                "bank_withdraw",
                                                                1,
                                                                "",
                                                                addressData
                                                            ]
        
        
                                                            db.query(insertWithdrawRequestProfit, [insertValues], (err, data) => {
                                                                if (err) {
                                                                    console.log("error while inserting data to all_transactions onlyProfit:", err)
                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                }
    
                                                            })
                                                        }
    
                                                        db.query(checkTransactionsExists, [tranId], (err, data) => {
                                                                if (err) {
                                                                    console.log("error while checking transactions:", err)
                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                }
                                                                console.log(data)
    
                                                                const transactionsData = data[0].count
    
    
                                                                if (transactionsData === 0) {
    
                                                                    if (profit <= 0) {
                                                                        const principalInsert = {
                                                                            PartnerID: userId,
                                                                            Amount: totalPrincipal,
                                                                            class: userClass,
                                                                            transection_user_have: sanUserHave,
                                                                            transection_status: "pending",
                                                                            transection_admin_verified: 0,
                                                                            transection_ceo_verified: 0,
                                                                            transection_is_principal: 1,
                                                                            transection_type: "withdraw",
                                                                            transection_tsx_id: tranId
                                                                        }
    
                                                                        db.query(insertQuery, principalInsert, (err, data) => {
                                                                            if (err) {
                                                                                console.log("error while insert principal:", err)
                                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                                            }
    
                                                                            db.commit(err => {
                                                                                if (err) {
                                                                                    console.log("error while commit all:", err)
                                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                                }
    
    
                                                                                return res.status(200).json("Make withdraw request success")
                                                                            })
                                                                        })
                                                                    } else {

                                                                        const bathProfit = (20 * (60 / 100)) * 30
                                                                        const bathPrincipal = (amount - profit) * rate
    
                                                                        const transactionValues = {
                                                                            PartnerID: userId,
                                                                            Amount: totalProfit,
                                                                            class: userClass,
                                                                            partner_share: totalPartnerShareOnlyProfit,
                                                                            company_share: totalCompanyShare,
                                                                            referer_share: totalReferrerShare,
                                                                            Referrer_one_ID: referrerShares[0]?.referrerId || null,
                                                                            referer_one_commission: referrerShares[0]?.commission || null,
                                                                            Referrer_two_ID: referrerShares[1]?.referrerId || null,
                                                                            referer_two_commission: referrerShares[1]?.commission || null,
                                                                            Referrer_three_ID: referrerShares[2]?.referrerId || null,
                                                                            referer_three_commission: referrerShares[2]?.commission || null,
                                                                            transection_user_have: bathProfit,
                                                                            transection_status: "pending",
                                                                            transection_admin_verified: 0,
                                                                            transection_ceo_verified: 0,
                                                                            transection_type: "withdraw",
                                                                            transection_tsx_id: tranId,
                                                                            transection_is_profit: 1
                                                                        }
        
        
        
                                                                        db.query(insertQuery, transactionValues, (err, data) => {
                                                                            if (err) {
                                                                                console.log("error while insert transactions:", err)
                                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                                            }
        
                                                                            const principalInsert = {
                                                                                PartnerID: userId,
                                                                                Amount: totalPrincipal,
                                                                                class: userClass,
                                                                                transection_user_have: bathPrincipal,
                                                                                transection_status: "pending",
                                                                                transection_admin_verified: 0,
                                                                                transection_ceo_verified: 0,
                                                                                transection_is_principal: 1,
                                                                                transection_type: "withdraw",
                                                                                transection_tsx_id: tranId
                                                                            }
        
                                                                            db.query(insertQuery, principalInsert, (err, data) => {
                                                                                if (err) {
                                                                                    console.log("error while insert principal:", err)
                                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                                }
        
                                                                                db.commit(err => {
                                                                                    if (err) {
                                                                                        console.log("error while commit all:", err)
                                                                                        return db.rollback(() => res.status(500).json("internal error"))
                                                                                    }
        
        
                                                                                    return res.status(200).json("Make withdraw request success")
                                                                                })
                                                                            })
                                                                        })
                                                                    }
    
                                                                }
                                                            })
                                                        // })
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


            } else {

                // console.log("not")
                db.query(queryCurrentRate, (err, data) => {
                    if (err) {
                        console.log("error while query curreny rate:", err)
                    }

                    const rate = data[0].currency_rate

                    db.query(checkQuota, [userId], (err, data) => {
                        if (err) {
                            console.log("error while checking quota", err)
                            return db.rollback(() => res.status(500).json("internal error"))
                        }
    
                        const quota = data[0].wallet_remaining
    
                        if (quota <= 0) {
                            console.log("error quota limit exceeded")
                            return db.rollback(() => res.status(403).json("Withdraw quota not enough"))
                        }
    
                        db.query(updateQuota, [userId], (err, data) => {
                            if (err) {
                                console.log("error while updating quota:", err)
                                return db.rollback(() => res.status(500).json("internal error"))
                            }
    
                            db.query(queryAddress, [userId], (err, data) => {
                                if (err) {
                                    console.log("error while querying address:", err)
                                    return db.rollback(() => res.status(500).json("internal error"))
                                }
    
                                const addressData = data[0].UCW_address
                                const chain = data[0].UCW_chain
                                const principal = data[0].wallet_principal
                                const profit = data[0].wallet_profit
    
                                // const totalPrincipal = sanAmount - profit
                                // const totalUserHave =  
    
                                db.query(checkUserQuery, [userId], (err,data) => {
                                    if (err) {
                                        console.log("error while checking user:", err)
                                        return db.rollback(() => res.status(500).json("internal error"))
                                    }
    
                                    const userClass = data[0].users_class
    
                                    db.query(checkComDistributed, [userId], (err, data) => {
                                        if (err) {
                                            console.log("error while distributing:", err)
                                            return db.rollback(() => res.status(500).json("internal error"))
                                        }
    
                                        const userDistributed = data[0]
                                        const userHavePercentage = userDistributed.PartnerSharePercentage
                                        const companyPercentage = userDistributed.CompanySharePercentage
    
                                        let totalReferrerShare = 0;
    
                                        db.query(queryCommission, [userId], (err, data) => {
                                            if (err) {
                                                console.log("error while query commission:", err)
                                                return db.rollback(() => res.status(500).json("internal error"))
                                            }
    
                                            const referers = data
    
                                            const referrerShares = referers.map(ref => {
                                                const share = sanAmount * (ref[`Level${ref.level}Commission`] / 100)
                                                totalReferrerShare += share
    
                                                return {
                                                    referrerId: ref.referrerID,
                                                    commission: share,
                                                    level: ref.level
                                                }
                                            })
    
                                            db.query(freezeQuery, [sanAmount, sanAmount, sanAmount,sanAmount, userId], (err, data) => {
                                                if (err) {
                                                    console.log("error while freeze for waiting transfer:", err)
                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                }
    
                                                const totalPartnerShareOnlyProfit = sanAmount * (userHavePercentage / 100)
                                                const CompanyShare = sanAmount * (companyPercentage / 100)
                                                const totalCompanyShare = CompanyShare - totalReferrerShare
    
                                                db.query(CheckIsExists, [tranId], (err, data) => {
                                                    if (err) {
                                                        return db.rollback(() => res.status(500).json("internal error"))
                                                    }
                    
                                                    const count = data[0].count
                    
                                                    if (count === 0) {
                    
                                                        const insertValues = [
                                                            tranId,
                                                            addressData,
                                                            sanAmount,
                                                            "ThaiBath",
                                                            userId,
                                                            "BATH",
                                                            sanUserHave,
                                                            sanAmount,
                                                            "bank_withdraw",
                                                            1,
                                                            "",
                                                            addressData
                                                        ]
    
                                                        db.query(insertWithdrawRequestProfit, [insertValues], (err, data) => {{
                                                            if (err) {
                                                                console.log("error while inserting data to all_transactions:", err)
                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                            }
    
                                                            db.query(checkTransactionsExists, [tranId], (err, data) => {
                                                                if (err) {
                                                                    console.log("error while checking transactions:", err)
                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                }
    
                                                                const transactionsData = data[0].count
                                                                // console.log(transactionsData)
    
                                                                if (transactionsData === 0) {
    
                                                                    const transactionValues = {
                                                                        PartnerID: userId,
                                                                        Amount: sanAmount,
                                                                        class: userClass,
                                                                        partner_share: totalPartnerShareOnlyProfit,
                                                                        company_share: totalCompanyShare,
                                                                        referer_share: totalReferrerShare,
                                                                        Referrer_one_ID: referrerShares[0]?.referrerId || null,
                                                                        referer_one_commission: referrerShares[0]?.commission || null,
                                                                        Referrer_two_ID: referrerShares[1]?.referrerId || null,
                                                                        referer_two_commission: referrerShares[1]?.commission || null,
                                                                        Referrer_three_ID: referrerShares[2]?.referrerId || null,
                                                                        referer_three_commission: referrerShares[2]?.commission || null,
                                                                        transection_user_have: sanUserHave,
                                                                        transection_status: "pending",
                                                                        transection_admin_verified: 0,
                                                                        transection_ceo_verified: 0,
                                                                        transection_type: "withdraw",
                                                                        transection_tsx_id: tranId,
                                                                        transection_is_profit: 1
                                                                    }
    
                                                                    db.query(insertQuery, transactionValues, (err, data) => {
                                                                        if (err) {
                                                                            console.log("error while insert transactions:", err)
                                                                            return db.rollback(() => res.status(500).json("internal error"))
                                                                        }
    
                                                                        db.commit(err => {
                                                                            if (err) {
                                                                                console.log("error while commit transactions:", err)
                                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                                            }
    
                                                                            return res.status(200).json("Make withdraw request success")
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }})
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

        })
    })

}

export const queryBankTransactions = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY,async (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const queryTransaction = `SELECT * FROM all_transactions WHERE AT_maker = ? AND AT_transaction_type = "bank_withdraw" ORDER BY AT_date_time DESC`

        // const connection = await db.getConnection();

        // try {
        //     await connection.beginTransaction();

        //     const [transactions] = await connection.query(queryTransaction, [userId])

        //     await connection.commit();

        //     return res.status(200).json(transactions)

        // } catch (error) {
        //     // await connection.rollback()
        //     console.error("error during queryBankTransactions:", error)
        //     return res.status(500).json("internal error")
        // } finally {
        //     // connection.release(); 
        // }
        db.beginTransaction(err => {
            if (err) {
                console.log("error while begin transaction:", err)
                return db.rollback(() => res.status(500).json("internal error"))
            }

            db.query(queryTransaction, [userId], (err, data) => {
                if (err) {
                    console.log("error while query transaction:", err)
                    return db.rollback(() => res.status(500).json("internal error"))
                }

                db.commit((err) => {
                    if (err) {
                        console.log("error while committing", err)
                        return db.rollback(() => res.status(500).json("internal error"))
                    }

                    return res.status(200).json(data)
                })
            })
        })

    })
}

// export const queryBankTransactions = async (req, res) => {
//     const token = req.cookies.access_token;

//     if (!token) {
//         return res.status(401).json("NOTOK");
//     }

//     try {
//         // ตรวจสอบ JWT token
//         const decoded = jwt.verify(token, process.env.TOKEN_KEY);
//         const userId = decoded.id;

//         const queryTransaction = `
//             SELECT * FROM all_transactions 
//             WHERE AT_maker = ? 
//               AND AT_transaction_type = "bank_withdraw" 
//             ORDER BY AT_date_time DESC
//         `;

//         // เริ่มการเชื่อมต่อและการ Transaction
//         const connection = await db.getConnection();
//         try {
//             await connection.beginTransaction();

//             const [transactions] = await connection.query(queryTransaction, [userId]);

//             // คอมมิต Transaction เมื่อเสร็จสิ้น
//             await connection.commit();
//             return res.status(200).json(transactions);

//         } catch (error) {
//             await connection.rollback(); // ยกเลิก Transaction หากมีข้อผิดพลาด
//             console.error("Error during queryBankTransactions:", error);
//             return res.status(500).json("Internal Server Error");
//         } finally {
//             connection.release(); // ปิดการเชื่อมต่อ
//         }

//     } catch (error) {
//         console.error("Token error or verification error:", error);
//         return res.status(403).json("Token error");
//     }
// };

export const getCryptoWallet = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id
        
        const query =  `
        SELECT 
          w.wallet_main_wallet, 
          w.wallet_freeze, 
          w.wallet_remaining, 
          a.UCW_address, 
          a.UCW_chain,
          w.wallet_profit,
          w.wallet_principal
        FROM wallet w 
        LEFT JOIN user_crypto_wallet a ON w.wallet_users_id = a.UCW_owner
        WHERE w.wallet_users_id = ?
      `

        db.query(query, [userId], (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json("internal error")
            }

            return res.status(200).json(data)
        })
    })
}

export const getCryptoWithdrawTransactions = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const queryWithdrawTransactions = `SELECT * FROM withdraw_transactions WHERE UT_maker = ?`
                            
        db.query(queryWithdrawTransactions, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            return res.status(200).json(data)
        })
    })
}

export const getWithdrawTransactions = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("Token error:")
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const query = `SELECT * FROM all_transactions WHERE AT_maker = ? AND AT_transaction_type = "crypto_withdraw" ORDER BY AT_date_time DESC`

        db.query(query, [userId], (err, data) => {
            if (err) {
                console.log("error while query transactions:", err)
                return res.status(500).json("internal error")
            }

            return res.status(200).json(data)
        })
    })
}

export const makeCryptoWithdrawRequest = (req, res) => {
    const token = req.cookies.access_token
    const { amount, userHave, includedPrincipal } = req.body

    if (!amount || !userHave) {
        return res.status(404).json("Please fill your amount correctly")
    }

    const sanAmount = sanitizeInput(amount)
    const sanUserHave = sanitizeInput(userHave)

    console.log(sanAmount)
    console.log(sanUserHave)
    console.log(includedPrincipal)

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const tranId = generateTransactionId()

        const queryAddress = `SELECT a.UCW_address, a.UCW_chain, w.wallet_principal, w.wallet_profit FROM user_crypto_wallet a JOIN wallet w ON a.UCW_owner = w.wallet_users_id WHERE w.wallet_users_id = ?`

        const checkUserQuery = "SELECT * FROM users WHERE users_id = ?"

        const CheckIsExists = `SELECT COUNT(*) AS count FROM all_transactions WHERE AT_transactions_hash = ?` 
                            
        const insertWithdrawRequest = "INSERT INTO all_transactions (  `AT_transactions_hash`,  `AT_to`,  `AT_value`,  `AT_token_name`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_principal`, `AT_crypto_chain`, `AT_user_address`) VALUES (?)"

        const insertWithdrawRequestBoth = "INSERT INTO all_transactions (  `AT_transactions_hash`,  `AT_to`,  `AT_value`,  `AT_token_name`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_both`, `AT_crypto_chain`, `AT_user_address`) VALUES (?)"

        const insertWithdrawRequestProfit = "INSERT INTO all_transactions (`AT_transactions_hash`, `AT_to`, `AT_value`, `AT_token_name`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_profit`, `AT_crypto_chain`, `AT_user_address`) VALUES (?)"

        const checkComDistributed = "SELECT cmd.* FROM commissiondistribution cmd LEFT JOIN users u ON cmd.class = u.users_class WHERE u.users_id = ?"

        const queryCommission = `WITH RECURSIVE commission_hierarchy AS (
                                SELECT 
                                    r.referredID, 
                                    r.referrerID, 
                                    cc.Level1Commission, 
                                    cc.Level2Commission, 
                                    cc.Level3Commission, 
                                    1 AS level
                                FROM referrals r
                                JOIN users u ON r.referrerID = u.users_id
                                JOIN Commissionclasses cc ON u.users_class = cc.class
                                WHERE r.referredID = ?
                                
                                UNION ALL
                                
                                SELECT 
                                    ch.referredID,
                                    r.referrerID, 
                                    cc.Level1Commission, 
                                    cc.Level2Commission, 
                                    cc.Level3Commission, 
                                    ch.level + 1
                                FROM commission_hierarchy ch
                                JOIN referrals r ON ch.referrerID = r.referredID
                                JOIN users u ON r.referrerID = u.users_id
                                JOIN CommissionClasses cc ON u.users_class = cc.class
                                WHERE ch.level < 3
                                )
                                SELECT * FROM commission_hierarchy ORDER BY level;`

        const freezeQuery = "UPDATE wallet SET wallet_waiting_transfer = ?, wallet_main_wallet = wallet_main_wallet - ?, wallet_freeze = wallet_freeze + ?, wallet_profit = wallet_profit - ? WHERE wallet_users_id = ?"

        const checkTransactionsExists = "SELECT COUNT(*) AS count FROM transactions WHERE transection_tsx_id = ?"

        const insertQuery = "INSERT INTO transactions SET ?"

        const checkQuota = "SELECT wallet_remaining FROM wallet WHERE wallet_users_id  = ?"

        const updateQuota = "UPDATE wallet SET wallet_remaining = wallet_remaining - 1 WHERE wallet_users_id = ?"



        db.beginTransaction(err => {
            if (err) {
                console.log("error while beginTransaction:", err)
                return db.rollback(() => res.status(500).json("internal error"))
            }

            if (includedPrincipal === 1) {
                // console.log("in")

                db.query(checkQuota, [userId], (err, data) => {
                    if (err) {
                        console.log("error while checking quota", err)
                        return db.rollback(() => res.status(500).json("internal error"))
                    }

                    const quota = data[0].wallet_remaining

                    if (quota <= 0) {
                        console.log("error quota limit exceeded")
                        return db.rollback(() => res.status(403).json("Withdraw quota not enough"))
                    }

                    db.query(updateQuota, [userId], (err, data) => {
                        if (err) {
                            console.log("error while updating quota:", err)
                            return db.rollback(() => res.status(500).json("internal error"))
                        }

                        db.query(queryAddress, [userId], (err, data) => {
                            if (err) {
                                console.log("error while querying address:", err)
                                return db.rollback(() => res.status(500).json("internal error"))
                            }

                            const addressData = data[0].UCW_address
                            const chain = data[0].UCW_chain
                            const principal = data[0].wallet_principal
                            const profit = data[0].wallet_profit

                            const totalPrincipal = sanAmount - profit
                            const totalProfit = sanAmount - totalPrincipal
                            console.log("totalprofit is:", totalProfit)
                            // const totalUserHave =  

                            db.query(checkUserQuery, [userId], (err,data) => {
                                if (err) {
                                    console.log("error while checking user:", err)
                                    return db.rollback(() => res.status(500).json("internal error"))
                                }

                                const userClass = data[0].users_class

                                db.query(checkComDistributed, [userId], (err, data) => {
                                    if (err) {
                                        console.log("error while distributing:", err)
                                        return db.rollback(() => res.status(500).json("internal error"))
                                    }

                                    const userDistributed = data[0]
                                    const userHavePercentage = userDistributed.PartnerSharePercentage
                                    const companyPercentage = userDistributed.CompanySharePercentage

                                    let totalReferrerShare = 0;

                                    db.query(queryCommission, [userId], (err, data) => {
                                        if (err) {
                                            console.log("error while query commission:", err)
                                            return db.rollback(() => res.status(500).json("internal error"))
                                        }

                                        const referers = data

                                        const referrerShares = referers.map(ref => {
                                            const share = sanAmount * (ref[`Level${ref.level}Commission`] / 100)
                                            totalReferrerShare += share

                                            return {
                                                referrerId: ref.referrerID,
                                                commission: share,
                                                level: ref.level
                                            }
                                        })

                                        db.query(freezeQuery, [sanAmount, sanAmount,sanAmount, totalProfit, userId], (err, data) => {
                                            if (err) {
                                                console.log("error while freeze for waiting transfer:", err)
                                                return db.rollback(() => res.status(500).json("internal error"))
                                            }

                                            const totalPartnerShareOnlyProfit = profit * (userHavePercentage / 100)
                                            const CompanyShare = profit * (companyPercentage / 100)
                                            const totalCompanyShare = CompanyShare - totalReferrerShare

                                            db.query(CheckIsExists, [tranId], (err, data) => {
                                                if (err) {
                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                }
                
                                                const count = data[0].count
                
                                                if (count === 0) {

                                                    if (includedPrincipal === 1 && profit > 0) {
                                                        const insertValues = [
                                                            tranId,
                                                            addressData,
                                                            sanAmount,
                                                            "TetherToken",
                                                            userId,
                                                            "USDT",
                                                            totalPartnerShareOnlyProfit + totalPrincipal,
                                                            sanAmount,
                                                            "crypto_withdraw",
                                                            1,
                                                            "BEP-20",
                                                            addressData
                                                        ]
    
    
                                                        db.query(insertWithdrawRequestBoth, [insertValues], (err, data) => {
                                                            if (err) {
                                                                console.log("error while inserting data to all_transactions both:", err)
                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                            }


                                                        })
                                                    } else if (includedPrincipal === 1 && profit === 0) {

                                                        const insertValues = [
                                                            tranId,
                                                            addressData,
                                                            sanAmount,
                                                            "TetherToken",
                                                            userId,
                                                            "USDT",
                                                            totalPartnerShareOnlyProfit + totalPrincipal,
                                                            sanAmount,
                                                            "crypto_withdraw",
                                                            1,
                                                            "BEP-20",
                                                            addressData
                                                        ]
    
    
                                                        db.query(insertWithdrawRequest, [insertValues], (err, data) => {
                                                            if (err) {
                                                                console.log("error while inserting data to all_transactions onlyprincipal:", err)
                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                            }

                                                        })
                                                    } else {
                                                        const insertValues = [
                                                            tranId,
                                                            addressData,
                                                            sanAmount,
                                                            "TetherToken",
                                                            userId,
                                                            "USDT",
                                                            totalPartnerShareOnlyProfit + totalPrincipal,
                                                            sanAmount,
                                                            "crypto_withdraw",
                                                            1,
                                                            "BEP-20",
                                                            addressData
                                                        ]
    
    
                                                        db.query(insertWithdrawRequestProfit, [insertValues], (err, data) => {
                                                            if (err) {
                                                                console.log("error while inserting data to all_transactions onlyProfit:", err)
                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                            }

                                                        })
                                                    }
                
                                                    // const insertValues = [
                                                    //     tranId,
                                                    //     addressData,
                                                    //     sanAmount,
                                                    //     "TetherToken",
                                                    //     userId,
                                                    //     "USDT",
                                                    //     totalPartnerShareOnlyProfit + totalPrincipal,
                                                    //     sanAmount,
                                                    //     "crypto_withdraw",
                                                    //     1,
                                                    //     "BEP-20",
                                                    //     addressData
                                                    // ]

                                                    // db.query(insertWithdrawRequestBoth, [insertValues], (err, data) => {
                                                    //     if (err) {
                                                    //         console.log("error while inserting data to all_transactions onlyProfit:", err)
                                                    //         return db.rollback(() => res.status(500).json("internal error"))
                                                    //     }

                                                        db.query(checkTransactionsExists, [tranId], (err, data) => {
                                                            if (err) {
                                                                console.log("error while checking transactions:", err)
                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                            }
                                                            console.log(data)

                                                            const transactionsData = data[0].count


                                                            if (transactionsData === 0) {

                                                                if (profit <= 0) {
                                                                    const principalInsert = {
                                                                        PartnerID: userId,
                                                                        Amount: totalPrincipal,
                                                                        class: userClass,
                                                                        transection_user_have: totalPrincipal,
                                                                        transection_status: "pending",
                                                                        transection_admin_verified: 0,
                                                                        transection_ceo_verified: 0,
                                                                        transection_is_principal: 1,
                                                                        transection_type: "withdraw",
                                                                        transection_tsx_id: tranId
                                                                    }

                                                                    db.query(insertQuery, principalInsert, (err, data) => {
                                                                        if (err) {
                                                                            console.log("error while insert principal:", err)
                                                                            return db.rollback(() => res.status(500).json("internal error"))
                                                                        }

                                                                        db.commit(err => {
                                                                            if (err) {
                                                                                console.log("error while commit all:", err)
                                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                                            }


                                                                            return res.status(200).json("Make withdraw request success")
                                                                        })
                                                                    })
                                                                } else {

                                                                    const transactionValues = {
                                                                        PartnerID: userId,
                                                                        Amount: totalProfit,
                                                                        class: userClass,
                                                                        partner_share: totalPartnerShareOnlyProfit,
                                                                        company_share: totalCompanyShare,
                                                                        referer_share: totalReferrerShare,
                                                                        Referrer_one_ID: referrerShares[0]?.referrerId || null,
                                                                        referer_one_commission: referrerShares[0]?.commission || null,
                                                                        Referrer_two_ID: referrerShares[1]?.referrerId || null,
                                                                        referer_two_commission: referrerShares[1]?.commission || null,
                                                                        Referrer_three_ID: referrerShares[2]?.referrerId || null,
                                                                        referer_three_commission: referrerShares[2]?.commission || null,
                                                                        transection_user_have: totalPartnerShareOnlyProfit,
                                                                        transection_status: "pending",
                                                                        transection_admin_verified: 0,
                                                                        transection_ceo_verified: 0,
                                                                        transection_type: "withdraw",
                                                                        transection_tsx_id: tranId,
                                                                        transection_is_profit: 1
                                                                    }
    
    
    
                                                                    db.query(insertQuery, transactionValues, (err, data) => {
                                                                        if (err) {
                                                                            console.log("error while insert transactions:", err)
                                                                            return db.rollback(() => res.status(500).json("internal error"))
                                                                        }
    
                                                                        const principalInsert = {
                                                                            PartnerID: userId,
                                                                            Amount: totalPrincipal,
                                                                            class: userClass,
                                                                            transection_user_have: totalPrincipal,
                                                                            transection_status: "pending",
                                                                            transection_admin_verified: 0,
                                                                            transection_ceo_verified: 0,
                                                                            transection_is_principal: 1,
                                                                            transection_type: "withdraw",
                                                                            transection_tsx_id: tranId
                                                                        }
    
                                                                        db.query(insertQuery, principalInsert, (err, data) => {
                                                                            if (err) {
                                                                                console.log("error while insert principal:", err)
                                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                                            }
    
                                                                            db.commit(err => {
                                                                                if (err) {
                                                                                    console.log("error while commit all:", err)
                                                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                                                }
    
    
                                                                                return res.status(200).json("Make withdraw request success")
                                                                            })
                                                                        })
                                                                    })
                                                                }

                                                            }
                                                        })
                                                    // })
                                                }
                                            })
                                        })
                                    })
                                })
                            })


                        })
                    })
                })

            } else {

                // console.log("not")
                db.query(checkQuota, [userId], (err, data) => {
                    if (err) {
                        console.log("error while checking quota", err)
                        return db.rollback(() => res.status(500).json("internal error"))
                    }

                    const quota = data[0].wallet_remaining

                    if (quota <= 0) {
                        console.log("error quota limit exceeded")
                        return db.rollback(() => res.status(403).json("Withdraw quota not enough"))
                    }

                    db.query(updateQuota, [userId], (err, data) => {
                        if (err) {
                            console.log("error while updating quota:", err)
                            return db.rollback(() => res.status(500).json("internal error"))
                        }

                        db.query(queryAddress, [userId], (err, data) => {
                            if (err) {
                                console.log("error while querying address:", err)
                                return db.rollback(() => res.status(500).json("internal error"))
                            }

                            const addressData = data[0].UCW_address
                            const chain = data[0].UCW_chain
                            const principal = data[0].wallet_principal
                            const profit = data[0].wallet_profit

                            // const totalPrincipal = sanAmount - profit
                            // const totalUserHave =  

                            db.query(checkUserQuery, [userId], (err,data) => {
                                if (err) {
                                    console.log("error while checking user:", err)
                                    return db.rollback(() => res.status(500).json("internal error"))
                                }

                                const userClass = data[0].users_class

                                db.query(checkComDistributed, [userId], (err, data) => {
                                    if (err) {
                                        console.log("error while distributing:", err)
                                        return db.rollback(() => res.status(500).json("internal error"))
                                    }

                                    const userDistributed = data[0]
                                    const userHavePercentage = userDistributed.PartnerSharePercentage
                                    const companyPercentage = userDistributed.CompanySharePercentage

                                    let totalReferrerShare = 0;

                                    db.query(queryCommission, [userId], (err, data) => {
                                        if (err) {
                                            console.log("error while query commission:", err)
                                            return db.rollback(() => res.status(500).json("internal error"))
                                        }

                                        const referers = data

                                        const referrerShares = referers.map(ref => {
                                            const share = sanAmount * (ref[`Level${ref.level}Commission`] / 100)
                                            totalReferrerShare += share

                                            return {
                                                referrerId: ref.referrerID,
                                                commission: share,
                                                level: ref.level
                                            }
                                        })

                                        db.query(freezeQuery, [sanAmount, sanAmount, sanAmount,sanAmount, userId], (err, data) => {
                                            if (err) {
                                                console.log("error while freeze for waiting transfer:", err)
                                                return db.rollback(() => res.status(500).json("internal error"))
                                            }

                                            const totalPartnerShareOnlyProfit = sanAmount * (userHavePercentage / 100)
                                            const CompanyShare = sanAmount * (companyPercentage / 100)
                                            const totalCompanyShare = CompanyShare - totalReferrerShare

                                            db.query(CheckIsExists, [tranId], (err, data) => {
                                                if (err) {
                                                    return db.rollback(() => res.status(500).json("internal error"))
                                                }
                
                                                const count = data[0].count
                
                                                if (count === 0) {
                
                                                    const insertValues = [
                                                        tranId,
                                                        addressData,
                                                        sanAmount,
                                                        "TetherToken",
                                                        userId,
                                                        "USDT",
                                                        totalPartnerShareOnlyProfit,
                                                        sanAmount,
                                                        "crypto_withdraw",
                                                        1,
                                                        chain,
                                                        addressData
                                                    ]

                                                    db.query(insertWithdrawRequestProfit, [insertValues], (err, data) => {{
                                                        if (err) {
                                                            console.log("error while inserting data to all_transactions:", err)
                                                            return db.rollback(() => res.status(500).json("internal error"))
                                                        }

                                                        db.query(checkTransactionsExists, [tranId], (err, data) => {
                                                            if (err) {
                                                                console.log("error while checking transactions:", err)
                                                                return db.rollback(() => res.status(500).json("internal error"))
                                                            }

                                                            const transactionsData = data[0].count
                                                            // console.log(transactionsData)

                                                            if (transactionsData === 0) {

                                                                const transactionValues = {
                                                                    PartnerID: userId,
                                                                    Amount: sanAmount,
                                                                    class: userClass,
                                                                    partner_share: totalPartnerShareOnlyProfit,
                                                                    company_share: totalCompanyShare,
                                                                    referer_share: totalReferrerShare,
                                                                    Referrer_one_ID: referrerShares[0]?.referrerId || null,
                                                                    referer_one_commission: referrerShares[0]?.commission || null,
                                                                    Referrer_two_ID: referrerShares[1]?.referrerId || null,
                                                                    referer_two_commission: referrerShares[1]?.commission || null,
                                                                    Referrer_three_ID: referrerShares[2]?.referrerId || null,
                                                                    referer_three_commission: referrerShares[2]?.commission || null,
                                                                    transection_user_have: totalPartnerShareOnlyProfit,
                                                                    transection_status: "pending",
                                                                    transection_admin_verified: 0,
                                                                    transection_ceo_verified: 0,
                                                                    transection_type: "withdraw",
                                                                    transection_tsx_id: tranId,
                                                                    transection_is_profit: 1
                                                                }

                                                                db.query(insertQuery, transactionValues, (err, data) => {
                                                                    if (err) {
                                                                        console.log("error while insert transactions:", err)
                                                                        return db.rollback(() => res.status(500).json("internal error"))
                                                                    }

                                                                    db.commit(err => {
                                                                        if (err) {
                                                                            console.log("error while commit transactions:", err)
                                                                            return db.rollback(() => res.status(500).json("internal error"))
                                                                        }

                                                                        return res.status(200).json("Make withdraw request success")
                                                                    })
                                                                })
                                                            }
                                                        })
                                                    }})
                                                }
                                            })
                                        })
                                    })
                                })
                            })


                        })
                    })
                })
            }


            // db.query(checkQuota, [userId], (err, data) => {
            //     if (err) {
            //         return db.rollback(() => res.status(500).json("internal error"))
            //     }

            //     const quota = data[0].wallet_remaining

            //     if (quota <= 0) {
            //         return db.rollback(() => res.status(403).json("Withdraw quota not enough"))
            //     }

            //     db.query(updateQuota, [userId], (err, data) => {
            //         if (err) {
            //             return db.rollback(() => res.status(500).json("internal error"))
            //         }

            //         db.query(queryAddress, [userId], (err, data) => {
            //             if (err) {
            //                 return db.rollback(() => res.status(500).json("internal error"))
            //             }
        
            //             const addressData = data[0].UCW_address
            //             const chain = data[0].UCW_chain
            //             const principal = data[0].wallet_principal
            //             const profit = data[0].wallet_profit

            //             const totalPrincipal = sanAmount - profit
            //             // console.log(totalPrincipal)
        
            //             const insertValues = [
            //                 tranId,
            //                 sanAmount,
            //                 addressData.UCW_address,
            //                 addressData.UCW_chain,
            //                 sanUserHave,
            //                 userId
            //             ]
        
            //             // db.query(insertWithdrawRequest, insertValues, (err, data) => {
            //             //     if (err) {
            //             //         return db.rollback(() => res.status(500).json("internal error"))
            //             //     }
        
                            
        
            //             //     db.commit(err => {
            //             //         if (err) {
            //             //             return db.rollback(() => res.status(500).json("internal error"))
            //             //         }
        
            //             //         return res.status(200).json("Make withdraw request successful")
            //             //     })
            //             // })
            //         })
            //     })
                

            // })

        })
    })
}