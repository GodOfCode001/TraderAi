import express from "express";
import { deposit, withdraw } from "../Controller/transection.js";

const router = express.Router();

router.post('/withdraw', withdraw)
router.post('/deposit', deposit)

export default router