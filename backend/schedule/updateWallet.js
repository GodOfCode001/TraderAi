import { db } from "../db.js";
import schedule from 'node-schedule'

export const updateWallet = () => {
    return schedule.scheduleJob('0 1 * * *', async () => {

        const updateQuery = `UPDATE wallet w
JOIN (
    SELECT b_maker AS user_id, SUM(b_user_get) AS total_transfer
    FROM bank_topup_transactions
    WHERE b_status = 'completed'
      AND b_created_at <= NOW() - INTERVAL 1 MONTH
    GROUP BY b_maker
) t
ON w.wallet_users_id = t.user_id
SET w.wallet_main_wallet = w.wallet_main_wallet + t.total_transfer,
    w.wallet_freeze = w.wallet_freeze - t.total_transfer
WHERE w.wallet_users_id = t.user_id
  AND w.wallet_freeze >= t.total_transfer;`

        const update = `UPDATE wallet SET `

        try {
            await new Promise((resolve, reject) => {
                db.query(updateQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                    if (results.affectedRows > 0) {
                        console.log("wallet Updated")
                    } else {
                        console.log("No wallet for update")
                    }
                })
            })

        } catch (error) {
            console.error("Error updating wallet:", error)
        }
    })
}

