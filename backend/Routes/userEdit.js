import express from 'express'
import { addCrypto, queryBank, queryCrypto, queryProfile, updateBank, updateCrypto, updateProfile } from '../Controller/userEdit.js'

const router = express.Router()

router.get('/get-crypto', queryCrypto)
router.get('/get-profile', queryProfile)
router.get('/get-bank', queryBank)
router.post('/update-profile', updateProfile)
router.post('/add-crypto', addCrypto)
router.post('/update-crypto', updateCrypto)
router.post('/update-bank', updateBank)

export default router