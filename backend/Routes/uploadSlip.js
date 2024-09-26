import e from "express";
import multer from 'multer'
import { google } from 'googleapis'
import fs from 'fs'
import dot from 'dotenv'
import { db } from "../db.js";
import jwt from 'jsonwebtoken'
dot.config()

const router = e.Router()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN })

const upload = multer({ dest: 'uploads/' })

const drive = google.drive({ version: 'v3', auth: oauth2Client })

async function uploadFileToDrive(filePath, fileName) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'image/png',
                parents: ['1q_VCyHrVO4XXQWfvEwTYL73E3-neUoBK']
            },
            media: {
                mimeType: 'image/png',
                body: fs.createReadStream(filePath),
            },
        })

        const fileId = response.data.id;

        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        console.log('File uploaded successfully to google drive:', response.data)
        return response.data
    } catch (error) {
        console.log('Error uploading file:', error)
        throw error
    }
}

const generateTransactionId = () => {
    return 'txn_' + Date.now() +  Math.random().toString(36).substr(2, 9)
}

router.post('/', upload.single('slip'), (req, res) => {
    const { amount, receiver, account, bank_name, user_get } = req.body
    const token = req.cookies.access_token
    const file = req.file
    // const amont = req.body.amount
    const transId = generateTransactionId()

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.status(401).json("NOTOK")
        }

        const userId = data.id

        try {
            const filePath = req.file.path;
            console.log(filePath)
            const fileName = req.file.originalname;
            console.log(fileName)
    
            const driveResponse = await uploadFileToDrive(filePath, fileName)
    
            const fileId = driveResponse.id
    
            const insertQuery = "INSERT INTO bank_topup_transactions (`b_transaction_id`, `b_amount`, `b_image_path`, `b_receiver`, `b_receiver_name`, `b_bank_name`, `b_maker`, `b_user_get`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    
            const values = [
                transId,
                amount,
                fileId,
                account,
                receiver,
                bank_name,
                userId,
                user_get
            ]
    
            db.query(insertQuery, values, (err, data) => {
                if (err) {
                    console.log('error while insert topup transactions:', err)
                    return res.status(500).json("internal error")
                }
    
                res.status(200).json("Transaction successfully")
            })
    
        } catch (error) {
            res.status(500).json({ message: 'Error uploading File:', error })
        } finally {
            fs.unlinkSync(req.file.path)
        }

    })

})

export default router