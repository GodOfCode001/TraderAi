import { db } from "../db.js"

export const getBlogCategory = (req, res) => {
    const query = "SELECT * FROM blog_category"

    db.query(query, (err, data) => {
        if (err) {
            console.log("error while query blog category", err)
            return res.status(500).json("internal error")
        }

        return res.status(200).json(data)
    })
}