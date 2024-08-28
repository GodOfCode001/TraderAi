import express from 'express';
import { adminGetTransection, ceoGetTransection } from '../Controller/getTransection.js';

const router = express.Router();

router.get('/adminGet', adminGetTransection);
router.get('/ceoGet', ceoGetTransection);

export default router