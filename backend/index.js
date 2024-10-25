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
import userWalletRoutes from './Routes/userWallet.js'
import currencyRoutes from './Routes/currency.js'
import transactionHistoryRoutes from './Routes/transactionHistory.js'
import rebateRoutes from './Routes/rebate.js'
import blogRoutes from './Routes/blog.js'
import blogCategoryRoutes from './Routes/blogCategory.js'
import uploadRoutes from './Routes/uploadImage.js'
import adminRoutes from './Routes/adminRoutes.js'
import { db } from './db.js'
import axios from 'axios'
import { coin } from './schedule/coin.js'
import { botWalletQuery } from './schedule/botWallet.js'
import { queryStatement } from './schedule/statement.js'
import { apiLimiter, resetLimiter } from './middleWare/apiRateLimit.js'
import { getERC20Transactions } from './schedule/Transactions.js'
import { deleteOldTransactions } from './schedule/deleteOldTransaction.js'
import { createSubAddress } from './schedule/createSubAddress.js'
import { deleteOldBankTrans } from './schedule/deleteOldBankTrans.js'
import { updateWallet } from './schedule/updateWallet.js'
import { updateQuota } from './schedule/updateQuota.js'



const corsOptions = {
    origin: 'http://localhost:5173', // Specify allowed origin(s)
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'], // Specify allowed method(s)
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Authorization'], // Specify allowed header(s)
    credentials: true
  };

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
app.use('/api/user-wallet', userWalletRoutes)
app.use('/api/currency', currencyRoutes)
app.use('/api/transaction-history', transactionHistoryRoutes)
app.use('/api/rebate', rebateRoutes)
app.use('/api/blog', blogRoutes)
app.use('/api/blog-category', blogCategoryRoutes)
app.use('/api/upload-image', uploadRoutes)
app.use('/api/admin', adminRoutes)

setTimeout(() => {
    const setCoin = coin();
    const queryWallet = botWalletQuery();
    const statement = queryStatement();
    const transactions = getERC20Transactions();
    const deleteOldTransaction = deleteOldTransactions()
    const createSubWallet = createSubAddress()
    const deleteOldBankTransactions = deleteOldBankTrans()
    const updatingWallet = updateWallet()
    const updateQuotaWallet = updateQuota()
}, 3000);


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