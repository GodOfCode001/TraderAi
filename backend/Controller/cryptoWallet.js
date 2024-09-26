import jwt from 'jsonwebtoken'
import { db } from '../db.js';

export const checkUserCryptoWallet = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        console.log("token required")
        return res.status(401).json("NOTOK")
    }

    // console.log(token)

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("Token error")
            return res.status(403).json("NOTOK")
        }

        const userId = data.id
        // console.log(userId)

        const walletCheck = "SELECT * FROM wallet w INNER JOIN sub_wallet_users s ON w.wallet_users_id = s.sub_owner WHERE w.wallet_users_id = ?"

        db.query(walletCheck, [userId], (err, data) => {
            if (err) {
                console.log("error while checking wallet")
                return res.status(404).json("Wallet not found")
            }

            if (data.length === 0) {
                return res.status(404).json("data not found")
            }

            // console.log(data)

            const {wallet_id, wallet_ref_wallet, wallet_total_topup, wallet_users_id,sub_id, sub_owner,sub_is_money_left, sub_index, sub_created_at, ...other} = data[0]
            // const wallet = data[0].sub_address
            // console.log(wallet)
            return res.status(200).json(other)
        })
    })
}