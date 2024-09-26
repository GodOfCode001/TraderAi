import express, { query } from 'express'
import cors from 'cors'
import dot from 'dotenv'
import WebSocket from 'ws'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import { ethers } from 'ethers'
dot.config()
import AuthRoutes from './Routes/auth.js'
import AdminProtectRoutes from './Routes/AdminProtectRoutes.js'
import getTransectionRoutes from './Routes/getTransection.js'
import TransectionRoutes from './Routes/transection.js'
import confirmRoutes from './Routes/confirm.js'
import CoinRoutes from './Routes/coin.js'
import forgetPasswordRoutes from './Routes/resetPassword.js'
import verifyTokenRoutes from './Routes/verifyToken.js'
import cryptoWalletCheckingRoutes from './Routes/cryptoWallet.js'
import queryCryptoTransactionsRoutes from './Routes/queryCryptoTrans.js'
import uploadSlipRoutes from './Routes/uploadSlip.js'
import depositBankRoutes from './Routes/depositBank.js'
import userEditRoutes from './Routes/userEdit.js'
import { db } from './db.js'
import axios from 'axios'
import { coin } from './schedule/coin.js'
import { botWalletQuery } from './schedule/botWallet.js'
import { queryStatement } from './schedule/statement.js'
import { apiLimiter, resetLimiter } from './middleWare/apiRateLimit.js'
import { getERC20Transactions } from './schedule/Transactions.js'
import { deleteOldTransactions } from './schedule/deleteOldTransaction.js'
import { createSubAddress } from './schedule/createSubAddress.js'
import { oauth2 } from 'googleapis/build/src/apis/oauth2/index.js'
import { google } from 'googleapis'


const corsOptions = {
    origin: 'http://localhost:5173', // Specify allowed origin(s)
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'], // Specify allowed method(s)
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Authorization'], // Specify allowed header(s)
    credentials: true
  };

const apiKey = process.env.W_API_KEY  
const apiSecret = process.env.W_API_SECRET

const app = express()
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
const port = process.env.PORT || 8801

app.use('/api/auth', apiLimiter, AuthRoutes)
app.use('/api/auth/isadmin', apiLimiter, AdminProtectRoutes)
app.use('/api/auth/forgetpassword', resetLimiter, forgetPasswordRoutes)
app.use('/api/auth/verify-token', verifyTokenRoutes)
app.use('/api/coins', CoinRoutes)
app.use('/api/getTransection', getTransectionRoutes)
app.use('/api/transection', TransectionRoutes)
app.use('/api/confirmation', confirmRoutes)
app.use('/api/checkuser-wallet', cryptoWalletCheckingRoutes)
app.use('/api/query-crypto-transactions', queryCryptoTransactionsRoutes)
app.use('/api/upload-slip', uploadSlipRoutes)
app.use('/api/deposit-bank', depositBankRoutes)
app.use('/api/user', userEditRoutes)


const setCoin = coin();
const queryWallet = botWalletQuery();
const statement = queryStatement();
const transactions = getERC20Transactions();
const deleteOldTransaction = deleteOldTransactions()
const createSubWallet = createSubAddress()

const CLIENT_ID = '835342509712-osucu8kfqm5dj7d3obdo8gtm8mb2rm9i.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:8800';
const REFRESH_TOKEN = '1//0gLTlxSZzwjOgCgYIARAAGBASNwF-L9IrmR4rOwNBR-DJjQi-KtBRjgYJAcYGCfHWryp3B2kpVHr0ppW-nV-z0SAyHzxUy9Zrfsc';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: "v3", auth: oauth2Client });

// ฟังก์ชันอ่านไฟล์
async function readFile(fileId) {
    try {
        const response = await drive.files.get({
            fileId: fileId,
            // alt: "media", // เพื่อดึงเนื้อหาไฟล์
            fields: 'webViewLink, webContentLink',
        });

        console.log('File content:', response.data);
        return response.data; // คืนค่าข้อมูลไฟล์
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

// Route สำหรับอ่านไฟล์
app.get("/read-file/:fileId", async (req, res) => {
    const fileId = req.params.fileId;
    
    try {
        const fileContent = await readFile(fileId);
        res.status(200).send(fileContent);
    } catch (error) {
        res.status(500).send('Error reading file');
    }
});

// const checkTransactions = async (address, chainId) => {
//     let provider;
    
//     if (chainId === 'avax') {
//         provider = new ethers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc');
//     } else if (chainId === 'bsc') {
//         provider = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org/');
//     } else {
//         throw new Error('Unsupported chain');
//     }

//     console.log(`Checking transactions for address ${address} on ${chainId.toUpperCase()} chain`);

//     try {
//         const latestBlock = await provider.getBlockNumber();
//         const transactions = [];

//         // ดึงข้อมูล 10 บล็อกล่าสุด (สามารถปรับจำนวนได้ตามต้องการ)
//         for (let i = 0; i < 10; i++) {
//             const block = await provider.getBlock(latestBlock - i, true);
//             console.log(block)
//             // if (block && block.transactions) {
//             //     const relevantTxs = block.transactions.filter(tx => 
//             //         tx.from.toLowerCase() === address.toLowerCase() || 
//             //         (tx.to && tx.to.toLowerCase() === address.toLowerCase())
//             //     );
//             //     transactions.push(...relevantTxs);
//             // }
//         }

//         if (transactions.length > 0) {
//             transactions.forEach((tx, index) => {
//                 console.log(`Transaction ${index + 1}:`);
//                 console.log(`  Hash: ${tx.hash}`);
//                 console.log(`  From: ${tx.from}`);
//                 console.log(`  To: ${tx.to || 'Contract Creation'}`);
//                 console.log(`  Value: ${ethers.formatEther(tx.value)} ${chainId.toUpperCase()}`);
//                 console.log('---');
//             });
//         } else {
//             console.log('No transactions found in the last 10 blocks');
//         }

//         console.log(`Total transactions found: ${transactions.length}`);
//     } catch (error) {
//         console.error(`Error fetching transactions: ${error.message}`);
//     }
// };

// // ตัวอย่างการใช้งาน
// const address = '0xEeCa50E8bD6c4Fb45099DfF50319aBA8B6A7E921';

// // ตรวจสอบธุรกรรมบน AVAX
// checkTransactions(address, 'avax');

// ตรวจสอบธุรกรรมบน BSC
// checkTransactions(address, 'bsc');

// const getTransactions = async (address) => {

//     const provider = new ethers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')
//     console.log(provider)
//     const history = await provider.getHistory(address)
//     history.foreach((tx) => {
//         console.log(tx)
//     })
// }

// getTransactions()
/////////////////////////////////////////////////////////////////////////

// สร้าง HTTP server

const server = http.createServer(app);

// สร้าง Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "*", // กำหนดให้รับการเชื่อมต่อจากทุกที่ (คุณอาจเปลี่ยนได้ตามต้องการ)
        methods: ["GET", "POST"]
    }
});

const onlineUsers = new Map();
const userHeartbeats = new Map();

const heartbeatInterval = 60000;

// ตั้งค่าการเชื่อมต่อ Socket.IO
io.on('connection', (socket) => {

    let heartbeatTimeout;

    // เมื่อผู้ใช้เชื่อมต่อและแจ้งว่าตนเองออนไลน์
    socket.on('user-online', (userId) => {
        onlineUsers.set(userId, socket.id);
        resetHeartbeatTimeout(userId);
        console.log("new user login is", userId + "now all connected" + [...onlineUsers.keys()]);
        io.emit('update-user-status', [...onlineUsers.keys()]); // ส่งข้อมูลผู้ใช้ที่ออนไลน์ไปยังทุกคน

        // Start the heartbeat timeout when the user is online
    });

    // ตั้งค่าการตรวจสอบ heartbeat
    socket.on('heartbeat', (userId) => {
        resetHeartbeatTimeout(userId);
        onlineUsers.set(userId, socket.id);

        socket.emit('update-user-status', [...onlineUsers.keys()]);
      });

    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('user-offline', (offlineId) => {

        let offlineUserId;

        for (let [userId, id] of onlineUsers) {


            if (offlineId === userId) {
                onlineUsers.delete(userId)
            } else {
                console.log("id not match")
            }
        }
        io.emit('update-user-status', [...onlineUsers.keys()]); // Update all clients
        clearTimeout(heartbeatTimeout);

    })

    function resetHeartbeatTimeout(userId) {

        if (userHeartbeats.has(userId)) {
            clearTimeout(userHeartbeats.get(userId)); // Clear any previous timeout
        }

        const timeout = setTimeout(() => {
            // console.log(`No heartbeat received from user ${userId} - assuming offline.`);

            onlineUsers.delete(userId)
            io.emit('update-user-status', [...onlineUsers.keys()]);
            userHeartbeats.delete(userId);
        } , heartbeatInterval)

        userHeartbeats.set(userId, timeout)
        
    }

    socket.on('disconnect', () => {
        // console.log('A user disconnected:', socket.id)

        const userSocket = socket.id

        for (const user of onlineUsers) {
            // console.log("dis:", user)

            // console.log('key:', user[0])
            // console.log('value:', user[1])

            if (userSocket === user[1]) {
                console.log("deleting user:", user[0])
                onlineUsers.delete(user[0])
            }
        }

    })


});

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});