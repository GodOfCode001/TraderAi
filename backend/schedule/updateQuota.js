import { db } from "../db.js";
import schedule from 'node-schedule'

export const updateQuota = () => {
    return schedule.scheduleJob('0 2 * * *', async () => {

        const updateQuery = `UPDATE wallet SET wallet_remaining = 5 WHERE wallet_remaining < 5`


        try {
            await new Promise((resolve, reject) => {
                db.query(updateQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                    if (results.affectedRows > 0) {
                        console.log("quota Updated")
                    } else {
                        console.log("No quota for update")
                    }
                })
            })

        } catch (error) {
            console.error("Error updating wallet:", error)
        }
    })
}

