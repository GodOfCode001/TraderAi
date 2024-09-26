import express from 'express'
import { queryCryptoTransaction } from '../Controller/queryCryptoTrans.js'

const router = express.Router()

router.get('/', queryCryptoTransaction)

export default router
