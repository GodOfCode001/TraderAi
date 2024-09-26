import express from 'express'
import { bankTopupTransactions, depositBank } from '../Controller/depositBank.js'

const router = express.Router()

router.get('/', depositBank)
router.get('/transactions', bankTopupTransactions)

export default router