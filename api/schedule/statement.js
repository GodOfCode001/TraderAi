import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import { db } from '../db.js';
import schedule from 'node-schedule';
dotenv.config()

const apiKey = process.env.W_API_KEY
const apiSecret = process.env.W_API_SECRET

export const queryStatement = async () => {
    return schedule.scheduleJob("*/20 * * * *", async () => {

        const timestamp = Date.now();
        const queryString = `incomeType=REALIZED_PNL&timestamp=${timestamp}`;
        const signature = crypto
            .createHmac('sha256', apiSecret)
            .update(queryString)
            .digest('hex');
    
        try {
            const res = await axios.get('https://fapi.binance.com/fapi/v1/income', {
                headers: {
                    'X-MBX-APIKEY': apiKey,
                },
                params: {
                    incomeType: 'REALIZED_PNL',
                    timestamp: timestamp,
                    signature: signature
                }
            });
    
            const state = res.data;
            // console.log(state)
    
            for (let item of state) {
                const date = new Date(item.time).toISOString().slice(0, 19).replace('T', ' ');
    
                // เช็คข้อมูลซ้ำ
                const checkQuery = "SELECT COUNT(*) AS count FROM statement WHERE statement_tradeId = ?";
                const checkValues = [item.tradeId];
    
                // ใช้ Promise เพื่อทำให้ query ทำงานเป็น async/await
                const checkResult = await new Promise((resolve, reject) => {
                    db.query(checkQuery, checkValues, (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });
    
                const count = checkResult[0].count;
    
                if (count === 0) {
                    // ถ้าไม่มีข้อมูลซ้ำ ให้ทำการเพิ่มข้อมูลใหม่
                    const insertQuery = "INSERT INTO statement (`statement_symbol`, `statement_income`, `statement_asset`, `statement_date_time`, `statement_info`, `statement_tranId`,  `statement_tradeId`) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    const insertValues = [
                        item.symbol,
                        item.income,
                        item.asset,
                        date,
                        item.info,
                        item.tranId,
                        item.tradeId
                    ];
    
                    await new Promise((resolve, reject) => {
                        db.query(insertQuery, insertValues, (err, results) => {
                            if (err) return reject(err);
                            resolve(results);
                        });
                    });
    
                    console.log("Statement inserted");
                } else {
                    console.log("Statement already exists");
                }
            } 
        } catch (error) {
            console.log(error);
        }
    })
};