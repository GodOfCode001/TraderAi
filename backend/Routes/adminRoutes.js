import express from 'express'
import { addNewUser, adminConfirm, adminDenied, changeRole, getCryptoTransactions, getUsers, getUsersChart } from '../Controller/adminRoutes.js'

const router = express.Router()

router.get('/get-users', getUsers)
router.get('/get-user-charts', getUsersChart)
router.get('/get-crypto-transactions', getCryptoTransactions)
router.put('/change-role', changeRole)
router.post('/add-new-user', addNewUser)
router.put('/admin-confirm', adminConfirm)
router.put('/admin-denied', adminDenied)

export default router