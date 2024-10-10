import express from "express";
import { getTransactionHistory } from "../Controller/transactionHistory.js";

const router = express.Router()

router.get('/', getTransactionHistory)

export default router