import { db } from "../db.js";
import schedule from 'node-schedule'

export const deleteOldBankTrans = () => {
    return schedule.scheduleJob('0 0 1 * *', async () => {

        const deleteQuery = `DELETE FROM transactions WHERE transection_date < CURDATE() - INTERVAL 1 MONTH;`

        try {
            await new Promise((resolve, reject) => {
                db.query(deleteQuery, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                    if (results.affectedRows > 0) {
                        console.log("Old transactions deleted")
                    } else {
                        console.log("No Old transactions for delete")
                    }
                })
            })

        } catch (error) {
            console.error("Error deleting old transactions:", error)
        }
    })
}