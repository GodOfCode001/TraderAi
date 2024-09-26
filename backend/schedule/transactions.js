import axios from "axios";
import { db } from "../db.js";
import schedule from 'node-schedule'
import dot from 'dotenv'
dot.config()

const bscKey = process.env.SNOW_KEY;

        //   console.log({
        //     TransactionHash: tx.hash,
        //     From: tx.from,
        //     To: tx.to,
        //     TokenName: tx.tokenName,
        //     TokenSymbol: tx.tokenSymbol,
        //     Amount: tx.value / Math.pow(10, tx.tokenDecimal), // Adjust for decimals
        //     Timestamp: new Date(tx.timeStamp * 1000).toLocaleString(),
        //   });
        // });

export const getERC20Transactions = async () => {
    return schedule.scheduleJob("* * * * *", () => {

      // console.log("Hello")

        const queryWallet = "SELECT * FROM crypto_wallet WHERE crpyto_wallet_isAvai = 1"

        db.query(queryWallet, async (err, result) => {
            if (err) {
                console.error(err)
                return 
            }

            const address = result[0]?.crypto_wallet_address
            // console.log(address)

            const url = `https://api.snowtrace.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${bscKey}`;
          
            try {
              const response = await axios.get(url);
              const data = response.data;
              // console.log(data)
          
              // Check if the result array exists
              if (data.status === '1' && Array.isArray(data.result)) {
                for (let item of data.result) {
                  const checkQuery = `SELECT COUNT(*) AS count FROM topup_transactions WHERE topup_hash = ?`;
                  const checkValues = [item.hash];
          
                  const checkResult = await new Promise((resolve, reject) => {
                    db.query(checkQuery, checkValues, (err, results) => {
                      if (err) return reject(err);
                      resolve(results);
                    });
                  });
          
                  const count = checkResult[0].count;
          
                  if (count === 0) {
                    const insertQuery = "INSERT INTO topup_transactions (`topup_block_number`, `topup_time_stamp`, `topup_hash`, `topup_block_hash`, `topup_from`, `topup_to`, `topup_contract_address`, `topup_value`, `topup_token_decimal`, `topup_token_name`, `topup_confirmations`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
          
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
                      item.confirmations
                    ];
          
                    await new Promise((resolve, reject) => {
                      db.query(insertQuery, insertValues, (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                      });
                    });
          
                    // console.log("Transaction inserted");
                  } else {
                    // console.log("Statement already up to date");
                  }
                }
    
              } else {
                console.log(`Error: ${data.message}`);
              }
            } catch (error) {
              console.error('Error fetching ERC20 transactions:', error.message);
            }
        })

    })
};