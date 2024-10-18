import express from 'express'
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/assets/blog");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix);
    },
})

const upload = multer({ storage })

const router = express.Router()

router.post("/blog", upload.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json("no file upladed")
    }

    const files = req.file

    res.status(200).json(files.filename)
})

export default router