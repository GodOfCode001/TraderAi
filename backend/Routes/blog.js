import express from 'express'
import { addBlog, editBlog, getBlog, getBlogs, getMenu } from '../Controller/blog.js'

const router = express.Router()

router.get('/get', getBlogs)
router.get('/get-single/:id', getBlog)
router.get('/get-menu', getMenu)
router.post('/add-blog', addBlog)
router.put('/edit/:id', editBlog)

export default router