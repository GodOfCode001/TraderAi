import express from 'express'
import { getBlogCategory } from '../Controller/blogCategory.js'

const router = express.Router()

router.get('/', getBlogCategory)

export default router