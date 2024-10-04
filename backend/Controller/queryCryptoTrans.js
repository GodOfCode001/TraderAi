import dot from 'dotenv'
import { db } from '../db.js';
import jwt from 'jsonwebtoken'
import axios from 'axios';
dot.config()

const bscKey = process.env.SNOW_KEY;

export const queryCryptoTransaction = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("Token is required")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            // console.log(err)
            return res.status(403).json("Token error")
        }

        const userId = data.id

        const q = `SELECT * FROM sub_wallet_users WHERE sub_owner = ?`

        db.query(q, [userId], async (err, data) => {
            if (err) {
                console.log("error while executing query:", err)
                return res.status(500).json("internal error")
            }

            const address = data[0].sub_address

            const url = `https://api.snowtrace.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${bscKey}`

            try {
                const response = await axios.get(url)
                const data = response.data

                if (data.status === '1' && Array.isArray(data.result)) {

                    for (let item of data.result) {
                        // console.log(item)
                        const checkQuery = `SELECT COUNT(*) AS count FROM all_transactions WHERE AT_transactions_hash = ?`

                        const checkValues = [item.hash];

                        const checkResult = await new Promise((resolve, reject) => {
                            db.query(checkQuery, checkValues, (err, result) => {
                                if (err) return reject(err)
                                resolve(result)
                            })
                        })
                        // console.log(checkResult)

                        const count = checkResult[0].count;
                        const totalGet = item.value / Math.pow(10, item.tokenDecimal)
                        // console.log(totalGet)

                        if (count === 0) {
                            const insertQuery = "INSERT INTO all_transactions (`AT_block_number`, `AT_time_stamp`, `AT_transactions_hash`, `AT_block_hash`, `AT_from`, `AT_to`, `AT_contract_address`, `AT_value`, `AT_token_decimal`, `AT_token_name`, `AT_crypto_confirmations`, `AT_maker`, `AT_crypto_symbol`, `AT_user_get`, `AT_amount`, `AT_transaction_type`, `AT_is_principal`, `AT_crypto_chain`, `AT_user_address`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

                            const insertValues = [
                                item.blockNumber,
                                item.timeStamp,
                                item.hash,
                                item.blockHash,
                                item.from,
                                item.to,
                                item.contractAddress,
                                item.value,
                                item.tokenDecimal,
                                item.tokenName,
                                item.confirmations,
                                userId,
                                item.tokenSymbol,
                                totalGet,
                                totalGet,
                                "crypto_deposit",
                                1,
                                "BEP-20",
                                item.from
                              ];

                            await new Promise((resolve, reject) => {
                                db.query(insertQuery, insertValues, (err, results) => {
                                    if (err) return reject(err);
                                    resolve(results)
                                })
                            })



                        } else {
                            console.log("transaction already up to date")
                        }

                        
                    }
                }

                const checkUserTransactions = "SELECT * FROM all_transactions WHERE AT_maker = ?"

                db.query(checkUserTransactions, [userId], (err, data) => {
                    if (err) {
                        console.log("error while check user transaction", err)
                        return res.status(404).json("Data not found")
                    }
                    // console.log(data)
                    return res.status(200).json(data)
                })

            } catch (error) {
                console.log(error)
                return res.status(500).json("internal error")
            }
        })
    })
}