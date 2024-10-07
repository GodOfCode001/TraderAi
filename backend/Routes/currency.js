import express from 'express'
import { getTHBRate } from '../Controller/currency.js'

const router = express.Router()

router.get('/get-thb-rate', getTHBRate)


export default router 