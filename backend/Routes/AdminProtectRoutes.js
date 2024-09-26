import express from 'express';
import { AdminProtect } from '../Controller/AdminProtectRoutes.js';

const router = express.Router();

router.get('/', AdminProtect)

export default router