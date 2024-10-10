import jwt from "jsonwebtoken"
import { db } from "../db.js"

export const getUserReabte = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const query = `
                    WITH RECURSIVE referral_hierarchy AS (
                        -- เริ่มจาก user ที่ระบุ (ใช้ ? เป็น parameter)
                        SELECT 
                            r.referredID, 
                            r.referrerID, 
                            0 AS level
                        FROM referrals r
                        WHERE r.referredID = ?  -- Parameter 1: user ID ที่ต้องการตรวจสอบ
                        UNION ALL
                        -- ค้นหา referral ของ referral ในลำดับถัดไป (ระดับ 1, 2 และ 3)
                        SELECT 
                            r.referredID, 
                            r.referrerID, 
                            rh.level + 1
                        FROM referral_hierarchy rh
                        JOIN referrals r ON rh.referredID = r.referrerID
                        WHERE rh.level < 3  -- จำกัดแค่ 3 ระดับ
                    ),
                    referral_withdrawals AS (
                        SELECT 
                            rh.referredID,
                            rh.referrerID,
                            rh.level,
                            COALESCE(SUM(at.AT_amount), 0) AS total_withdrawn
                        FROM 
                            referral_hierarchy rh
                        LEFT JOIN 
                            all_transactions at ON at.AT_maker = rh.referredID
                        WHERE 
                            at.AT_transaction_type IN ('crypto_withdraw', 'bank_withdraw')
                            OR at.AT_transaction_type IS NULL
                        GROUP BY
                            rh.referredID, rh.referrerID, rh.level
                    )
                    SELECT 
                        u.users_id,
                        u.users_class,
                        w.wallet_main_wallet,
                        cc.*, 
                        cd.*, 
                        (SELECT COUNT(*) FROM referrals WHERE referrerID = ?) as registeredCount,
                        COALESCE(rw.total_withdrawn, 0) AS total_team_withdrawals,
                        (
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'referredID', rw2.referredID,
                                    'referrerID', rw2.referrerID,
                                    'level', rw2.level,
                                    'withdrawn', rw2.total_withdrawn
                                )
                            )
                            FROM referral_withdrawals rw2
                        ) AS team_withdrawal_details
                    FROM 
                        users u
                    JOIN 
                        commissionclasses cc ON u.users_class = cc.class
                    JOIN 
                        commissiondistribution cd ON u.users_class = cd.class
                    JOIN
                        wallet w ON u.users_id = w.wallet_users_id
                    LEFT JOIN
                    referral_withdrawals rw ON u.users_id = rw.referredID AND rw.level = 0
                    WHERE 
                        u.users_id = ?; 
        `

        db.query(query, [userId, userId, userId, userId], (err, data) => {
            if (err) {
                console.log("error while query commission rebate:", err)
                return res.status(500).json("internal error")
            }

            return res.status(200).json(data)
        })
    })
}