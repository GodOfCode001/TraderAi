import multer from 'multer'
import { google } from 'googleapis'
import fs from 'fs'
import dot from 'dotenv'
dot.config()

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

export const uploadFileToSlip = async (filePath, fileName) => {
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

export const uploadFileToBookBank = async (filePath, fileName) => {
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