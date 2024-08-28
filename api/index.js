import express, { query } from 'express'
import cors from 'cors'
import dot from 'dotenv'
import WebSocket from 'ws'
import http from 'http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
dot.config()
import AuthRoutes from './Routes/auth.js'
import getTransectionRoutes from './Routes/getTransection.js'
import TransectionRoutes from './Routes/transection.js'
import confirmRoutes from './Routes/confirm.js'
import CoinRoutes from './Routes/coin.js'
import { db } from './db.js'
import axios from 'axios'
import { coin } from './schedule/coin.js'
import { botWalletQuery } from './schedule/botWallet.js'
import { queryStatement } from './schedule/statement.js'

const apiKey = process.env.W_API_KEY  
const apiSecret = process.env.W_API_SECRET

const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
const port = process.env.PORT || 8801

app.use('/api/auth', AuthRoutes)
app.use('/api/coins', CoinRoutes)
app.use('/api/getTransection', getTransectionRoutes)
app.use('/api/transection', TransectionRoutes)
app.use('/api/confirmation', confirmRoutes)

const setCoin = coin();
const queryWallet = botWalletQuery();
const statement = queryStatement();

// app.listen(port, () => {
//     console.log("Running on port", port)
// })

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

// console.log(onlineUsers)
const heartbeatInterval = 60000;

setInterval(() => {
    console.log(onlineUsers)
    // console.log(userHeartbeats)

    // for (let [keys, value] of userHeartbeats) {

    //     console.log("heart is", keys + " " + value._idleTimeout)
    // }
}, 30000);

console.log(Date(1724678121866))

// ตั้งค่าการเชื่อมต่อ Socket.IO
io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    let heartbeatTimeout;

    // เมื่อผู้ใช้เชื่อมต่อและแจ้งว่าตนเองออนไลน์
    socket.on('user-online', (userId) => {
        // console.log(userId)
        onlineUsers.set(userId, socket.id);
        resetHeartbeatTimeout(userId);
        io.emit('update-user-status', [...onlineUsers.keys()]); // ส่งข้อมูลผู้ใช้ที่ออนไลน์ไปยังทุกคน

        // Start the heartbeat timeout when the user is online
    });

    // ตั้งค่าการตรวจสอบ heartbeat
    socket.on('heartbeat', (userId) => {
        resetHeartbeatTimeout(userId);
        console.log(`Heartbeat received from user ${userId}`);
        onlineUsers.set(userId, socket.id);
      });

    // เมื่อผู้ใช้ตัดการเชื่อมต่อ
    socket.on('user-offline', (offlineId) => {
        console.log('socket useroffline is', offlineId);

        let offlineUserId;

        for (let [userId, id] of onlineUsers) {
            // console.log("all user id", userId + id)
            // console.log("id",id)

            if (offlineId === userId) {
                onlineUsers.delete(userId)
                console.log("logout user is", userId)
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
            console.log(`No heartbeat received from user ${userId} - assuming offline.`);

            onlineUsers.delete(userId)
            io.emit('update-user-status', [...onlineUsers.keys()]);
            userHeartbeats.delete(userId);
        } , heartbeatInterval)

        // console.log("id before set heartbeat", userId);
        userHeartbeats.set(userId, timeout)
        
    }

    // socket.on('disconnect', () => {
    //     // console.log('A user disconnected:', socket.id);
    //     console.log('A user disconnected:', socket.id);

    //     // ลบผู้ใช้จาก onlineUsers
    //     let offlineUserId;
    //     for (let [userId, id] of onlineUsers) {
    //         if (id === socket.id) {
    //             offlineUserId = userId;
    //             console.log("users close window", offlineUserId)
    //             onlineUsers.delete(userId);
    //             // break;
    //         }
    //     }

    //     io.emit('update-user-status', [...onlineUsers.keys()]); // ส่งข้อมูลผู้ใช้ที่ออนไลน์ไปยังทุกคน

    //     // ทำการ logout เมื่อผู้ใช้ offline
    //     if (offlineUserId) {
    //         // ส่งคำขอ logout ไปที่ backend
    //         fetch(`http://localhost:${port}/api/auth/logout`, {
    //             method: 'POST',
    //             credentials: 'include', // ส่ง cookies ไปด้วย
    //             body: JSON.stringify({ userId: offlineUserId }), // ส่ง userId ไปด้วย
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => console.log('Logout user close window:', offlineUserId, data))
    //         .catch(err => console.log('Logout error:', err));
    //     }
    // });
});

server.listen(port, () => {
    console.log(`Running on port ${port}`);
});