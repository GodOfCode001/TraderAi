import express from "express";
import { checkUserCryptoWallet } from "../Controller/cryptoWallet.js";

const router = express.Router()

router.get('/', checkUserCryptoWallet)

export default router