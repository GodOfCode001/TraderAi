import express from 'express';
import { adminConfirm, ceoConfirm } from '../Controller/comfirm.js';

const router = express.Router();

router.post('/admin', adminConfirm)
router.post('/ceo', ceoConfirm)

export default router