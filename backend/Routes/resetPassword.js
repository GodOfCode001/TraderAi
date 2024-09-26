import express from 'express'
import { resetPassword, resetSuccess } from '../Controller/resetPassword.js'

const router = express.Router()

router.post("/", resetPassword)
router.post('/resetpassword', resetSuccess)

export default router