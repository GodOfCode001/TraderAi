import jwt from "jsonwebtoken";
import { db } from "../db.js";
import { sanitizeInput } from "../middleWare/Sanitize.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/assets/blog");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix);
    },
})

export const getBlogs = (req, res) => {

  const category = req.query.cat

    const query = category === "all" 
    ? "SELECT * FROM blog LIMIT ? OFFSET ?"
    : "SELECT * FROM blog WHERE blog_category = ? LIMIT ? OFFSET ?"

    const limit = parseInt(req.query.limit) || 6; 
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const queryParams = category === "all"
    ? [limit, offset]
    : [category, limit, offset];

    const countQuery = category === "all"
    ? "SELECT COUNT(*) AS total FROM blog"
    : "SELECT COUNT(*) AS total FROM blog WHERE blog_category = ?"

    const countParams = category === "all" ? [] : [category];

    db.query(countQuery, countParams, (err, countData) => {
        if (err) {
            console.log("Error while counting blogs:", err);
            return res.status(500).json("Internal error");
        }

        const totalBlogs = countData[0].total;
        const totalPages = Math.ceil(totalBlogs / limit); // คำนวณจำนวนหน้า

        db.query(query, queryParams, (err, data) => {
          if (err) {
            console.log("error while querying blog:", err);
            return res.status(500).json("internal error");
          }
      
          return res.status(200).json({
            blogs: data,
            totalPages: totalPages,
            currentPage: page
          });
        });

    })
};

export const getBlog = (req, res) => {
    const value = req.params.id
    const id = value.split("&")[0]
  const query = `
                SELECT 
                b.blog_id, b.blog_username, b.blog_title, b.blog_desc, b.blog_img, 
                u.users_image AS userImage, b.blog_category, b.blog_date_time 
                FROM users u 
                JOIN blog b ON u.users_id = b.blog_uid 
                WHERE b.blog_id = ?
                `;

    db.query(query, [id], (err, data) => {
        if (err) {
            console.log("error while query single blog:", err)
            return res.status(500).json("internal error")
        }

        return res.status(200).json(data[0])
    })
};

export const getMenu = (req, res) => {
    const category = req.query.cat

    const query = "SELECT * FROM blog WHERE blog_category = ?"

    db.query(query, [category], (err, data) => {
        if (err) {
            console.log("error while query menu:", err)
            return res.status(500).json("internal error")
        }

        return res.status(200).json(data)
    })
}

export const addBlog = (req, res) => {
    const token = req.cookies.access_token;
    const { blog_title, blog_desc, blog_category, blog_img, blog_username, blog_userImg } = req.body
    
    if (!token) {
        console.log("Here")
        return res.status(401).json("Not Authenticated")
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
        if (err) {
            return res.status(403).json("token error")
        }

        const userId = data.id
        const userRole = data.usersRole
        
        const checkUserQuery = "SELECT * FROM users WHERE users_id = ?"

        db.query(checkUserQuery, [userId], (err, data) => {
            if (err) {
                console.log("error while checking user for add blog:", err)
                return res.status(500).json("internal error")
            }

            const user_role = data[0].users_role

            if (user_role !== userRole && user_role !== "blogger") {
                console.log("role not matched for add the blog")
                return res.status(403).json("Not Authenticated")
            }

            const insertQuery = 
            "INSERT INTO blog (`blog_title`, `blog_desc`, `blog_img`, `blog_category`, `blog_uid`, `blog_username`, `blog_userImg`) VALUES (?)";

            const values = [
                blog_title,
                blog_desc,
                blog_img,
                blog_category,
                userId,
                blog_username,
                blog_userImg
            ]

            db.query(insertQuery, [values], (err, data) => {
                if (err) {
                    console.log("error while inserting blog details:", err)
                    return res.status(500).json("internal error")
                }

                res.status(200).json("Blog added successfully")
            })
        })
    })
}

export const editBlog = (req, res) => {

    upload(req, res, (err) => {
        if (err) {
            console.log("error while upload image at update blog", err)
            return res.status(500).json("internal error")
        }

        const token = req.cookies.access_token

        if (!token) {
            return res.status(401).json("Not authenticated")
        }
    
        jwt.verify(token, process.env.TOKEN_KEY, (err, data) => {
            if (err) {
                console.log("error while update blog:", err)
                return res.status(403).json("token error")
            }
    
            const userId = data.id
            const userRole = data.userRole
    
            if (userRole !== "blogger") {
                return res.status(403).json("Not authenticated")
            }
    
            const sanTitle = sanitizeInput(blog_title)
            const sanDesc = sanitizeInput(blog_desc)
            const sanCategory = sanitizeInput(blog_category)
            const blog_img_filename = req.file.filename
    
            const BlogId = req.params.id;
            const q =
            "UPDATE blog SET `blog_title` = ?, `blog_desc` = ?, `blog_img` = ?, `blog_category` = ?, WHERE blog_id = ?, AND blog_uid = ?";
    
            const value = [
                sanTitle,
                sanDesc,
                blog_img_filename,
                sanCategory,
            ]

            db.query(q, [...value, BlogId, userId], (err, data) => {
                if (err) {
                    console.log("error while updating blog:", err)
                    return res.status(500).json("internal error")
                }

                return res.status(200).json("Blog has been updated")
            })
        })
    })
}
