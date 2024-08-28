import { db } from "../db.js"

export const getCoins = (req, res) => {
    const query = "SELECT * FROM coin"

    db.query(query, (err,data) => {
        if (err) {
            console.log(err)
            return res.status(500).json("Internal Server Error");
        }
        return res.status(200).json(data)
    })
}