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

            const queryUserWallet = `SELECT UBW_account FROM user_bank_wallet WHERE UBW_owner = ?`
    
            const insertQuery = "INSERT INTO all_transactions (`AT_transactions_hash`, `AT_amount`, `AT_img_path`, `AT_to`, `AT_receiver_name`, `AT_bank_name`, `AT_maker`, `AT_user_get`, `AT_transaction_type`, `AT_user_address`, `AT_from`, `AT_is_principal`, `AT_crypto_symbol`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    


            db.query(queryUserWallet, [userId], (err, data) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json("Internal error")
                }

                const userwallet = data[0].UBW_account

                const values = [
                    transId,
                    amount,
                    fileId,
                    account,
                    receiver,
                    bank_name,
                    userId,
                    user_get,
                    "bank_deposit",
                    userwallet,
                    userwallet,
                    1,
                    "bath"
                ]

                db.query(insertQuery, values, (err, data) => {
                    if (err) {
                        console.log('error while insert topup transactions:', err)
                        return res.status(500).json("internal error")
                    }
        
                    res.status(200).json("Transaction successfully")
                })
            })
    
    
        } catch (error) {
            res.status(500).json({ message: 'Error uploading File:', error })
        } finally {
            fs.unlinkSync(req.file.path)
        }

    })

})

export default router