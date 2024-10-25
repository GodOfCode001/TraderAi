import mysql from 'mysql2'
import dot from 'dotenv'
dot.config()

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'tradingai0.3'
})

// export const db = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '123456',
//     database: process.env.DB_NAME || 'tradingai0.3',
//     connectionLimit: 20,          // เพิ่ม connection limit รองรับ concurrent users
//     waitForConnections: true,
//     queueLimit: 0,
//     connectTimeout: 30000
// });

// // Graceful shutdown เมื่อมีการ exit
// process.on('SIGINT', () => {
//     db.end(err => {
//         if (err) console.error('Error closing pool:', err);
//         process.exit(err ? 1 : 0);
//     });
// });