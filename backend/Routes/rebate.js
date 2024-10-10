import express from "express";
import { getUserReabte } from "../Controller/rebate.js";

const router = express.Router()

router.get('/', getUserReabte)

export default router