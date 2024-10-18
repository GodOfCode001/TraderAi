import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Edit from "/assets/icons/edit.png";
import Delete from "/assets/icons/delete.png";
import DOMPurify from "dompurify";
import Menu from "../components/Menu";
import "./singleBlog.css";
import axios from "axios";

const SingleBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser, backend } = useContext(AuthContext);
  const [post, setPost] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/blog/get-single/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [postId]);

  // const handleDelete = async ()=>{
  //   try {
  //     await axios.delete(`/posts/${postId}`);
  //     navigate("/")
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  return (
    <div className="single">
      <div className="single-blog">
        {isLoading ? (
          <>
            <div className="single-blog-container-skeleton">
              <div className="single-image-skeleton"></div>
              <div className="user-skeleton">
                <div className="profile-skeleton"></div>
                <div className="info-skeleton">
                  <span className="username-skeleton"></span>
                  <p className="date-skeleton"></p>
                </div>
              </div>
              <h1 className="title-skeleton"></h1>
              <p className="desc-skeleton"></p>
              <p className="desc-skeleton"></p>
              <p className="desc-skeleton"></p>
              <p className="desc-skeleton"></p>
            </div>

            <div className="blog-menu">
              <h1 className="menu-skeleton"></h1>
              {Array(4)
                .fill()
                .map((_, idx) => (
                  <div className="post-menu-skeleton" key={idx}>
                    <div className="link-skeleton">
                      <div className="post-menu-image-skeleton"></div>
                    </div>
                    <div className="link-skeleton">
                      <h2 className="post-menu-title-skeleton"></h2>
                    </div>
                    <div className="link-btn-skeleton"></div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <div className="single-blog-container">
              <img src={`/assets/blog/${post?.blog_img}`} alt="" />
              <div className="user">
                {post?.userImage && (
                  <img src={`/assets/web-logo/${post.userImage}`} alt="" />
                )}
                <div className="info">
                  <span>{post?.blog_username}</span>
                  <p>Posted {moment(post?.blog_date_time).fromNow()}</p>
                </div>
                {currentUser &&
                  currentUser.users_username === post?.blog_username && (
                    <div className="edit">
                      <Link
                        to={`/blog/write?edit=${post?.blog_id}`}
                        state={post}
                      >
                        <img src={Edit} alt="" />
                      </Link>
                      <img src={Delete} alt="" />
                    </div>
                  )}
              </div>
              <h1>{post?.blog_title}</h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post?.blog_desc),
                }}
              ></p>
            </div>
            <Menu cat={post?.blog_category} />
          </>
        )}


      </div>
    </div>
  );
};

export default SingleBlog;
