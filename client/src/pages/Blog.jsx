import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './blog.css'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Blog = () => {

  const [posts, setPosts] = useState([])
  const { backend, WEB_URL } = useContext(AuthContext)
  const [limit] = useState(4)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true) 
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCategory, setCurrentCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const tabsRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += scrollOffset;
    }
};
  
  const navigate = useNavigate();
  const { pathname } = useLocation()
  const search = useLocation().search
  const searchParams = new URLSearchParams(search)
  const cat = searchParams.get('category')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search])

  const prevCatRef = useRef();
  useEffect(() => {
    prevCatRef.current = cat;
  });
const prevCat = prevCatRef.current;

// fetch category

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${backend}/api/blog-category`)
      setCategories(res.data)
    }
    fetchData()
  }, [backend, limit, page, search])

// fetch content

  useEffect(() => {
    const fetchData = async () => {

      let newPage = page;

      if (cat !== prevCat) {
        newPage = 1;
      }

      try {
        const res = await axios.get(`${backend}/api/blog/get`, {
          params: {cat, page: newPage, limit},
          withCredentials: true
        })
        setPosts(res.data.blogs)
        setTotalPages(res.data.totalPages)
        console.log(res.data.totalPages)
        setCurrentPage(res.data.currentPage)
        setIsLoading(false)
        
        navigate(`/blog?category=${cat}&page=${newPage}`, {
          replace: true, 
        });
      } catch (error) {
        console.log(error)
      }
      setPage(newPage)
    }
    fetchData()
  }, [backend, limit, page, cat])

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      // Fetch new data when page changes
      navigate(`/blog?category=${cat}&page=${newPage}`);
    }
  }

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  // const renderPaginationItems = () => {
  //   let items = []
  //   const maxVisiblePages = 5
    
  //   if (totalPages <= maxVisiblePages) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       items.push(
  //         <button
  //           key={i}
  //           onClick={() => handlePageChange(i)}
  //           className={`pagination-number ${page === i ? 'active' : ''}`}
  //         >
  //           {i}
  //         </button>
  //       )
  //     }
  //   } else {
  //     items.push(
  //       <button
  //         key={1}
  //         onClick={() => handlePageChange(1)}
  //         className={`pagination-number ${page === 1 ? 'active' : ''}`}
  //       >
  //         1
  //       </button>
  //     )

  //     if (page > 3) {
  //       items.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>)
  //     }

  //     for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
  //       items.push(
  //         <button
  //           key={i}
  //           onClick={() => handlePageChange(i)}
  //           className={`pagination-number ${page === i ? 'active' : ''}`}
  //         >
  //           {i}
  //         </button>
  //       )
  //     }

  //     if (page < totalPages - 2) {
  //       items.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>)
  //     }

  //     items.push(
  //       <button
  //         key={totalPages}
  //         onClick={() => handlePageChange(totalPages)}
  //         className={`pagination-number ${page === totalPages ? 'active' : ''}`}
  //       >
  //         {totalPages}
  //       </button>
  //     )
  //   }

  //   return items
  // }

  const renderPaginationItems = () => {
    let items = [];
    const maxVisiblePages = 5;
  
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-number ${page === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show the first page
      items.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`pagination-number ${page === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );
  
      // Show ellipsis before current pages
      if (page > 3) {
        items.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
  
      // Show pages around the current page
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        items.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-number ${page === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
  
      // Show ellipsis after current pages
      if (page < totalPages - 2) {
        items.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
  
      // Show the last page
      items.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`pagination-number ${page === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }
  
    return items;
  };

  const breadcrumbs = [
    { label: 'ประเภทงานทั้งหมด', path: '/' },
    { label: 'เว็บไซต์และเทคโนโลยี', path: '/web-technology' },
    { label: 'Web Development', path: '/web-development' },
  ];

  return (
    <div className='blog'>

<div className="category-header">
      {/* <div className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <Link to={crumb.path}>{crumb.label}</Link>
            {index < breadcrumbs.length - 1 && <span> &gt; </span>}
          </React.Fragment>
        ))}
      </div> */}
       <h1 className="category-title">หัวข้อสำหรับแต่ละบทความ</h1>
 <div className="category-tabs-container">
        <button className="scroll-button left" onClick={() => scroll(-100)} aria-label="Scroll left">
          <ChevronLeft size={24} />
        </button>
        <div className="category-tabs" ref={tabsRef}>
          {categories.map((category) => (
            <Link
              key={category.cat_id}
              to={`/blog/?category=${category.cat_path}&page=${1}`}
              className={`category-tab ${cat === category.cat_name_id ? 'active' : ''}`}
            >
              {category.cat_name}
            </Link>
          ))}
        </div>
        <button className="scroll-button right" onClick={() => scroll(100)} aria-label="Scroll right">
          <ChevronRight size={24} />
        </button>
      </div>
      {/* <div className="filters">
        <button className="filter-button">
          <i className="icon-filter"></i> ตัวกรอง
        </button>
        <button className="filter-button">
          <i className="icon-sort"></i> เรียงตาม
        </button>
        <label className="toggle-switch">
          <input type="checkbox" />
          <span className="slider round"></span>
          <span className="label">ผู้เชี่ยวชาญ</span>
        </label>
        <label className="toggle-switch">
          <input type="checkbox" />
          <span className="slider round"></span>
          <span className="label">รับแบ่งจ่าย</span>
        </label>
        <label className="toggle-switch">
          <input type="checkbox" />
          <span className="slider round"></span>
          <span className="label">ตอบกลับเร็ว</span>
        </label>
      </div> */}
    </div>

        <div className="blog-container">

        {isLoading ? (
          // แสดงโครงร่าง Skeleton เมื่อข้อมูลกำลังโหลด
          Array(4).fill().map((_, idx) => (
            <div className="skeleton post" key={idx}>
              <div className="img skeleton-img"></div>
              <div className="content skeleton-content">
                <h1 className="skeleton-title"></h1>
                <h1 className="skeleton-title-second"></h1>
                <div className="subcontent">
                  <p className="skeleton-text"></p>
                  <p className="skeleton-text"></p>
                  <p className="skeleton-text"></p>
                  <p className="skeleton-text"></p>
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.map((post) => (
            <div className="post" key={post.blog_id}>
              <div className="img">
                <img src={`/assets/blog/${post.blog_img}`} alt="" />
              </div>
              <div className="content">
                <Link className="link" to={`/blog/${post.blog_id}&category=${post.blog_category}`}>
                  <h1>{post.blog_title}</h1>
                </Link>
                <div className="subcontent">
                  <p>{getText(post.blog_desc)}</p>
                  <button>Read More</button>
                </div>
              </div>
            </div>
          ))
        )}

        
        </div>

        <div className="pagination">
  <button 
    onClick={() => handlePageChange(page - 1)} 
    disabled={page === 1} // Disable when on the first page
    className="pagination-button"
  >
    <ChevronLeft size={20} />
  </button>
  {renderPaginationItems()}
  <button 
    onClick={() => handlePageChange(page + 1)} 
    disabled={page === totalPages} // Disable when on the last page
    className="pagination-button"
  >
    <ChevronRight size={20} />
  </button>
</div>
    </div>
  )
}

export default Blog