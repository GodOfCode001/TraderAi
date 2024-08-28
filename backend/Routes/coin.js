import express from "express";
import { getCoins } from "../Controller/coin.js";

const router = express.Router();

router.get('/get', getCoins)

export default router