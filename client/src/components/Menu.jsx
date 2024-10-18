import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios'

const Menu = ({cat}) => {

  const { backend } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [limit] = useState(4)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/blog/get-menu`, {
          params: {cat},
          withCredentials: true
        })
        console.log(res)
        setPosts(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [cat])

    
  return (
    <div className='blog-menu'>
        <h1>Other posts you may like</h1>
    {posts.map((post) => (
      <div className="post" key={post.id}>
        <Link className='link' to={`/blog/${post.blog_id}&category=${post.blog_category}`}>
        <img src={`/assets/blog/${post?.blog_img}`} alt="" />
        </Link>
        <Link className='link' to={`/blog/${post.blog_id}&category=${post.blog_category}`}>
        <h2>{post.blog_title}</h2>
        </Link>
        <Link className='link link-btn' to={`/blog/${post.blog_id}&category=${post.blog_category}`}>Read More</Link>
      </div>
    ))}</div>
  )
}

export default Menu