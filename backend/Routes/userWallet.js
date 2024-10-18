import express from "express";
import { getCryptoWallet, getWallet, getWithdrawTransactions, makeCryptoWithdrawRequest, queryBankTransactions, queryCommission, queryMainWallet, withdrawRequest } from "../Controller/userWallet.js";

const router = express.Router()

router.get('/', getWallet)
router.get('/get-main-wallet', queryMainWallet)
router.get('/get-commission', queryCommission)
router.get('/get-transactions', queryBankTransactions)
router.get('/crypto-wallet', getCryptoWallet)
router.get('/get-withdraw-transactions', getWithdrawTransactions)
router.post('/withdraw-request', withdrawRequest)
router.post('/crypto-withdraw-request', makeCryptoWithdrawRequest)

export default router