import axios from 'axios'
import schedule from 'node-schedule'
import { db } from '../db.js';

export const coin = () => {
    return schedule.scheduleJob('0 * * * *', async () => {
        try {
            const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false&locale=en');
            const coinData = res.data;
    
            const updatePromises = coinData.map((coin, index) => {
                const query = "UPDATE coin SET coin_name = ?, coin_symbol = ?, coin_price = ?,  coin_change_percentage = ?,  coin_img_path = ? WHERE coin_id = ?" 
                const values = [
                    coin.name,
                    coin.symbol,
                    coin.current_price,
                    coin.price_change_percentage_24h,
                    coin.image,
                    index + 1
                ];
    
                return new Promise((resolve, reject) => {
                    db.query(query, values, (err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });
            });
    
            await Promise.all(updatePromises);
            console.log("All coin data updated successfully");
        } catch (error) {
            console.error("Error:", error);
        }
    })
}