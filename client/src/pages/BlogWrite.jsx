import React, { useContext, useEffect, useState } from 'react'
import ReactQuill, { displayName } from 'react-quill'
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from 'react-router-dom'
import './blogWrite.css'
import axios from "axios"
import moment from "moment"
import Menu from '../components/Menu';
import { AuthContext } from "../context/AuthContext"

const BlogWrite = () => {

  useEffect(() => {
    
  })

  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "")
  const [file, setFile] = useState(state?.img || null)
  const [value, setValue] = useState(state?.desc || "")
  const [cat, setCat] = useState(state?.cat || "")
  const {backend, currentUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const upload = async () => {
    try {
        const formData = new FormData();
        formData.append("file", file)
        const res = await axios.post(`${backend}/api/upload-image/blog`, formData)
        return res.data;
    } catch (error) {
        console.log(error)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault();

    const files = await upload()

    try {
      state
        ? await axios.put(`${backend}/api/blog/edit/${state.id}`, {
            blog_title: title,
            blog_desc: value,
            blog_category: cat,
            blog_img: files
            }
            , {
            headers: { "Content-Type": "multipart/form-data" }, 
            withCredentials: true
        })
        : await axios.post(`${backend}/api/blog/add-blog`, {
            blog_title: title,
            blog_desc: value,
            blog_category: cat,
            blog_img: files,
            blog_username: currentUser.users_username,
            blog_userImg: currentUser.users_image
            }, {withCredentials: true});
            console.log("blog has been uploaded")
        //   navigate("/blog")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='blog-write'>
        <div className="blog-write-container">

            <div className="content">
                <input 
                type="text" 
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />

                <div className="editor-container">
                    <ReactQuill 
                        className='editor'
                        theme='snow'
                        value={value}
                        onChange={setValue}
                    />
                </div>
            </div>

            <div className="menu">
                <div className="item">
                    <h1>Publish</h1>
                    <span>
                        <b>Status: </b> Draft
                    </span>
                    <span>
                        <b>Visibility: </b> Public
                    </span>
                    <input
                    type="file"
                    id='file'
                    style={{display: "none"}}
                    name=''
                    onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label className='file' htmlFor="file">
                        Upload Image
                    </label>
                    <div className="buttons">
                        <button>Save as a draft</button>
                        <button onClick={handleClick}>Publish</button>
                    </div>
                </div>

                <div className="item">
                    <h1>Category</h1>

                    <div className="cat">
                        <input 
                        type="radio"
                        checked={cat === "art"} 
                        name='cat'
                        value='art'
                        id='art'
                        onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="art">Art</label>
                    </div>

                    <div className="cat">
                        <input 
                        type="radio"
                        checked={cat === "science"} 
                        name='cat'
                        value='science'
                        id='science'
                        onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="science">Science</label>
                    </div>

                    <div className="cat">
                        <input 
                        type="radio"
                        checked={cat === "teachnology"} 
                        name='cat'
                        value='teachnology'
                        id='teachnology'
                        onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="teachnology">Teachnology</label>
                    </div>

                    <div className="cat">
                        <input 
                        type="radio"
                        checked={cat === "cinema"} 
                        name='cat'
                        value='cinema'
                        id='cinema'
                        onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="cinema">Cinema</label>
                    </div>

                    <div className="cat">
                        <input 
                        type="radio"
                        checked={cat === "design"} 
                        name='cat'
                        value='design'
                        id='design'
                        onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="design">Design</label>
                    </div>

                    <div className="cat">
                        <input 
                        type="radio"
                        checked={cat === "food"} 
                        name='cat'
                        value='food'
                        id='food'
                        onChange={(e) => setCat(e.target.value)}
                        />
                        <label htmlFor="food">Food</label>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default BlogWrite