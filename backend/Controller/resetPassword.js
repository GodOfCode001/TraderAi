import { sendPasswordResetEmail } from "../Components/nodeMailer.js"
import { db } from "../db.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { sanitizeInput } from "../middleWare/Sanitize.js"

export const resetPassword = (req, res) => {
    const { email } = req.body

    console.log(email)

    const q = `SELECT * FROM users WHERE users_email = ?`
    db.query(q, [email], async (err, data) => {
        if (err) {
            console.log("error query data for resetpassword:", err)
            return res.status(500).json("Internal Server Error")
        }

        if (data.length === 0) {
            return res.status(404).json("Account not found")
        }

        // const username = data[0]?.users_username
        // const pass = data[0]?.users_password

        // const salt = bcrypt.genSaltSync(10)
        // const userHash = bcrypt.hashSync(username, salt)

        // const keyHash = process.env.TOKEN_KEY + pass
        // const secret = bcrypt.hashSync(keyHash, salt)

        // const token = jwt.sign({id: userHash}, secret, {expiresIn: '10m'})
        // const tokenSecret = token + pass
        // const tokenHash = bcrypt.hashSync(tokenSecret, salt)

        const userId = data[0]?.users_id;
        const username = data[0]?.users_username;

        // Generate a short-lived JWT token (10 minutes)
        const tokenHash = jwt.sign({ id: userId }, process.env.TOKEN_KEY, { expiresIn: '5m' });

        try {
            // const mailSent = await sendPasswordResetEmail(email,username, token);
            const mailSent = await sendPasswordResetEmail(email, username,  tokenHash);
            if (mailSent) {
                return res.status(200).json("If your email exists, a reset link has been sent.")
            } else {
                return res.status(500).json("Error while sending password reset email")
            }
        } catch (error) {
            console.log("Error while sending email:", error)
            return res.status(500).json("Failed to send emailing")
        }
    })
}

export const resetSuccess = (req, res) => {
    const { password, tokenHash } = req.body

    const sanPass = sanitizeInput(password)

    jwt.verify(tokenHash, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            console.log("verify failed")
            // console.log(err)
            return res.status(404).json("Token invalid please try again")
        }

        const user = data?.id
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(sanPass, salt)

        const q = `UPDATE users SET users_password = ? WHERE users_id = ?`
        
        db.query(q, [hashedPassword, user], (err, data) => {
            if (err) {
                console.log("Error updating password:")
                return res.status(500).json("internal server error")
            }

            return res.status(200).json("Password has been successfully reset")
        })

    })

}