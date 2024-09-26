import jwt from 'jsonwebtoken'
import { db } from '../db.js';
import bcrypt from 'bcrypt'
import { sanitizeEmailInput, sanitizeInput } from '../middleWare/Sanitize.js';
import { google } from 'googleapis';
import multer from 'multer';
import fs from 'fs'
import { uploadFileToBookBank } from '../Components/uploadDriveSlip.js';
import dot from  'dotenv'
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

export const queryCrypto = (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("TOKEN ERROR")
        }

        const userId = data.id

        const query = "SELECT * FROM user_crypto_wallet WHERE UCW_owner = ? LIMIT 1"

        db.query(query, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            if (data.length === 0) {
                return res.status(400).json("data not found")
            }

            return res.status(200).json(data)
        })
    })
}

export const queryProfile =  (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("Token error")
        }

        const userId = data.id
        const queryProfile = "SELECT * FROM users WHERE users_id = ?"
        db.query(queryProfile, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            if (data.length === 0) {
                return res.status(404).json("data not found")
            } else {

                const { users_password, users_is_admin, ...other } = data[0]

                return res.status(200).json(other)
            }
        })
    })
}

export const updateProfile = (req, res) => {
    const token = req.cookies.access_token
    const { user, email, gender, birthday, address, country, password, newPassword } = req.body

    // console.log(user)
    // console.log(email)
    // console.log(gender)
    // console.log(address)
    // console.log(country)
    // console.log(password)
    // console.log(newPassword)

    const sanUser = sanitizeInput(user)
    const sanEmail = sanitizeEmailInput(email)
    const sanGender = sanitizeInput(gender)
    const sanAddress = sanitizeInput(address)
    const sanCountry = sanitizeInput(country)

    // console.log(sanUser)
    // console.log(sanEmail)
    // console.log(sanGender)
    // console.log(sanAddress)
    // console.log(sanCountry)

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEy, (err, data) => {
        if (err) {
            return res.status(401).json("NOTOK")
        }

        const userId = data.id

        const queryCheck = "SELECT * FROM users WHERE users_id = ?"

        db.query(queryCheck, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            if (data.length === 0) {
                return res.status(404).json("data not found")
            }

            const pass = data[0].users_password


            if (password) {
    
                const sanPassword = sanitizeInput(password)
                const sanNewPassword = sanitizeInput(newPassword)

                const isPassCorrect = bcrypt.compareSync(sanPassword, pass)

                if (!isPassCorrect) {
                    return res.status(404).json("Your old password not correct")
                }

                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(sanNewPassword, salt)
    
                const query = "UPDATE users SET users_username = ?, users_password = ?, users_email = ?, users_address = ?, users_gender = ?, users_birthday = ?, users_country = ? WHERE users_id = ?"

                const updateValues = [
                    sanUser,
                    hash,
                    sanEmail,
                    sanAddress,
                    sanGender,
                    birthday,
                    sanCountry,
                    userId
                ]

                db.query(query, updateValues, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json("Internal error")
                    }

                    return res.status(200).json("Update profile successfully")
                })
            } else {
                const updateQuery = "UPDATE users SET users_username = ?, users_email = ?, users_address = ?, users_gender = ?, users_birthday = ?, users_country = ? WHERE users_id = ?";

                const updateValues = [
                    sanUser,
                    sanEmail,
                    sanAddress,
                    sanGender,
                    birthday,
                    sanCountry,
                    userId
                ]

                db.query(updateQuery, updateValues, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json("internal error")
                    }

                    return res.status(200).json("Update profile successfully")
                })
            }


        })



    })
}

export const addCrypto = (req, res) => {
    const token = req.cookies.access_token;
    const { chain, address } = req.body;
    console.log(chain)
    console.log(address)
    console.log(token)

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("TOKEN ERROR")
        }

        const userId = data.id

        const query = "INSERT INTO user_crypto_wallet (`UCW_address`, `UCW_chain`, `UCW_owner`) VALUES (?, ?, ?)"

        const values = [
            address,
            chain,
            userId
        ]

        db.query(query, values, (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            return res.status(200).json("Crypto address updated successfully")
        })
    })
}

export const updateCrypto = (req, res) => {
    const token = req.cookies.access_token;
    const { chain, address } = req.body;



    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("TOKEN ERROR")
        }

        const userId = data.id

        const queryCheck = "SELECT * FROM user_crypto_wallet WHERE UCW_owner = ?"

        const InsertQuery = "INSERT INTO user_crypto_wallet (`UCW_address`, `UCW_chain`, `UCW_owner`) VALUES (?, ?, ?)"

        const updateQuery = "UPDATE user_crypto_wallet SET UCW_address = ?, UCW_chain = ?, UCW_owner = ? WHERE UCW_owner = ?"

        const insertValues = [
            address,
            chain,
            userId
        ]

        const updateValues = [
            address,
            chain,
            userId,
            userId
        ]

        db.query(queryCheck, [userId], (err, data) => {
            if (err) {
                return res.status(500).json("Internal error")
            }

            if (data.length === 0) {
                db.query(InsertQuery, insertValues, (err, data) => {
                    if (err) {
                        return res.status(500).json("Internal error")
                    }
                    return res.status(200).json("Data has been update successfully")
                })
            } else {
                db.query(updateQuery, updateValues, (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json("Internal error")
                    }
    
                    return res.status(200).json("Data has been update successfully")
                })
            }


            
        })
    })
}

export const queryBank = (req, res) => {
    const token = req.cookies.access_token

    if (!token) {
        return res.status(401).json("NOTOK")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(401).json("Token error")
        }

        const userId = data.id

        const q = "SELECT * FROM user_bank_wallet WHERE UBW_owner = ?"

        db.query(q, userId, (err, data) => {
            if (err) {
                return res.status(500).json("internal error")
            }

            if (data.length === 0) {
                return res.status(404).json("data not found")
            } else {
                return res.status(200).json(data)
            }
        })
    })
}

export const updateBank = [
    upload.single('bookBank'),
    (req, res) => {
       const token = req.cookies.access_token
       const { account, accountName, bankName, fileId } = req.body

       const sanAcc = sanitizeInput(account)
       const sanAccName = sanitizeInput(accountName)
       const sanBankName = sanitizeInput(bankName)

       if (!token) {
           return res.status(401).json("NOTOK")
       }
   
       jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
           if (err) {
               return res.status(401).json("Token error")
           }
           const userId = data.id
   
           const checkQuery = 'SELECT * FROM user_bank_wallet WHERE UBW_owner = ?'
   
           db.query(checkQuery, [userId], async (err, data) => {
               if (err) {
                   return res.status(500).json("internal error")
               }

               if (data.length === 0) {
   
                const filePath = req.file.path;
                const fileName = req.file.originalname;

                const driveresponse = await uploadFileToBookBank(filePath, fileName)

                const fileId = driveresponse.id


   
                const insertQuery = "INSERT INTO user_bank_wallet (`UBW_account`, `UBW_bank_account_name`, `UBW_bank_name`, `UBW_owner`, `UBW_img_path`) VALUES (?,?,?,?,?)"

                const insertValues = [
                    sanAcc,
                    sanAccName,
                    sanBankName,
                    userId,
                    fileId    
                ]

                db.query(insertQuery, insertValues, (err, data) => {
                    if (err) {
                        return res.status(500).json("internal error")
                    }

                    return res.status(200).json("Update bank successfully")
                })
               } else {

                let updatedFileId = fileId
                   
                   if (req.file) {

                        const filePath = req.file.path;
                        const fileName = req.file.originalname;

                        const driveresponse = await uploadFileToBookBank(filePath, fileName)
                        updatedFileId = driveresponse.id
                    } 

                    const updateQuery = 'UPDATE user_bank_wallet SET UBW_account = ?, UBW_bank_account_name = ?, UBW_bank_name = ?, UBW_img_path = ? WHERE UBW_owner = ?'
                        
                    const updateValues = [
                        sanAcc,
                        sanAccName,
                        sanBankName,
                        updatedFileId,
                        userId
                    ]

                    db.query(updateQuery, updateValues, (err, data) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).json("internal error")
                        }

                        return res.status(200).json("Update bank successfully")
                    })
                    // else {
                    //     const updatequery = 'UPDATE user_bank_wallet SET UBW_account = ?, UBW_account_name = ?, UBW_bank_name = ? WHERE UBW_owner = ?'

                    //     const updateQuery = [
                    //         account,
                    //         accountName,
                    //         bankName,
                    //         userId
                    //     ]

                    //     db.query(updatequery, updateQuery, (err, data) => {
                    //         if (err) {
                    //             return res.status(500).json("internal error")
                    //         }

                    //         return res.status(200).json("Update bank successfully")
                    //     })
                    // }

                }

           })
       })
   }
]