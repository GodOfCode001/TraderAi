import express from "express";
import { verifyToken } from "../Controller/verifyToken.js";

const router = express.Router()

router.get('/', verifyToken)

export default router