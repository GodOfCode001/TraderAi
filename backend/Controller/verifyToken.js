import jwt from 'jsonwebtoken'

export const verifyToken = (req, res) => {

    const token = req.cookies.access_token
    
    if (!token) {
        return res.status(403).json({message: "Token is required"})
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            // console.log("Verify token failed")
            return res.status(403).json({message: "NOTOK"})
        }
        // console.log("Verifyed")
        return res.status(200).json({message: "OK"})
    })

}