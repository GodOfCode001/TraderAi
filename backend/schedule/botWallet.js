import axios from "axios";
import crypto from 'crypto'
import dotenv from 'dotenv'
import { db } from "../db.js";
dotenv.config()
import schedule from 'node-schedule'

const apiKey = process.env.W_API_KEY
const apiSecret = process.env.W_API_SECRET

export const botWalletQuery = () => {
    return schedule.scheduleJob('*/30 * * * *',async () => {

        const timestamp = Date.now();
        const now = new Date();
        const updateTime = now.toLocaleString('en-US', { 
            hour12: false, 
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        }).replace(/,/g, '');

        // Create the query string
        const queryString = `timestamp=${timestamp}`;

        // Sign the query string
        const signature = crypto
        .createHmac('sha256', apiSecret)
        .update(queryString) 
        .digest('hex');

        // Make the request
        try {
            const res = await axios.get(`https://fapi.binance.com/fapi/v2/account`, {
                headers: {
                  'X-MBX-APIKEY': apiKey,
                },
                params: {
                  timestamp: timestamp,
                  signature: signature,
                }
              })
            const asset = res.data.assets;
            const usdtInfo  = asset.find(asset => asset.asset === "USDT");
            // const date = usdtInfo.updateTime
            // const updatetime = new Date(date).toLocaleString()
            // console.log(updatetime)
    
            const update = "UPDATE bot_wallet SET bot_wallet_assets = ?, bot_wallet_maxWithdrawAmount = ?, bot_wallet_balance = ?, bot_wallet_available = ?, bot_wallet_time = STR_TO_DATE(?, '%m/%d/%Y %H:%i:%s') WHERE bot_wallet_assets = ?"
    
            const values = [
                usdtInfo.asset,
                usdtInfo.maxWithdrawAmount,
                usdtInfo.walletBalance,
                usdtInfo.availableBalance,
                updateTime,
                usdtInfo.asset
            ]
    
            db.query(update, values, (err, data) => {
                if (err)  {
                    console.log("error update bot wallet", err)
                }
                console.log("Query and update bot wallet successfully")
            })
    
        } catch (error) {
            console.log(error)
        }
    })
}