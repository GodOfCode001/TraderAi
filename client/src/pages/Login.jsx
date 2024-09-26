import React, { useContext, useState } from 'react'
import './register.css'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";


const Login = () => {
    const {t} = useTranslation()
    const { login, resetTimer } = useContext(AuthContext)
    const [inputs, setInputs] = useState({
      username: "",
      password: "",
    })
    const [loading, setLoading] = useState(false)



    const handleChange = (e) => {
      setInputs(prev=> ({...prev, [e.target.name]: e.target.value }))
    }

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()
      if (inputs.username === "") {
        alert("Please enter a username")
      }

      if (inputs.password === "") {
        alert("Please enter a password")
      }

      try {
        // console.log("going to login")
        setLoading(true)
        await login(inputs)
        setLoading(false)
        resetTimer();
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "ล็อคอินสำเร็จ"
        });
        navigate("/")
      } catch (error) {
        console.log(error)
        setLoading(false)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response?.data}`,
        });
      }
    }
  return (
    <div className='register'>
      <div className="video-background">
        <video autoPlay muted loop id="bg-video">
          <source src="/assets/bgvideo/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
          </video>
        </div>

      <div className="register-container">
        <div className="register-card">

        <div className="left">
            <div className="header">
              <h2>บัญชีเดียวสำหรับบริการทั้งหมดของ TraderAI</h2>
            </div>

            <div className="step">

              <div className="text">
                <p>สวัสดีค่ะ! ลงทะเบียนบัญชีและเพลิดเพลินกับประสบการณ์การเทรดบน TraderAI.</p>
              </div>
            </div>

            <div className="step">

              <div className="text">
                <Link to="/register">
                  <button className='register-btn'> {t("big-register")} </button>
                </Link>
              </div>
            </div>

          </div>

          <div className="right">
            <div className="header">
              <h2>เข้าสู่ระบบ</h2>
            </div>

            <form action="" onSubmit={handleSubmit} className='form-div'>

            <div className="inputs-div">

            <div className="inputs">
              <div className="icon"><FaRegUser /> </div>
              <input required type="text" id="username" name="username" placeholder="Username" onChange={handleChange}/>
            </div>


            <div className="inputs">
              <div className="icon"><RiLockPasswordLine /> </div>
              <input required type="password" id="password" name="password" placeholder="Password" onChange={handleChange}/>
            </div>

            <div className="forget-password">

            </div>

            </div>

            <div className="buttons-div">
            <div className="buttons">
            <div className="asking">
              {/* {t("id-asking")}  */}
              <Link className='forget-btn' to="/forget-password">
              <p>ลืมรหัสผ่าน ?</p>
              </Link>
            </div>

              <button className="confirm-btn loading-btn" type="submit">
                {loading ? <div className='loader'></div> : <p>{t("big-login")}</p>}
              
              </button>
            </div>
            </div>

            </form>


          </div>

            {/* <fieldset>
                <legend> {t("big-login")} </legend>
                <div className="name">{t("web-name")}</div>
                <div className='welcome'>{t("login-welcome")}</div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">username: <span className='red'>*</span> </label>
                    <input required type="text" name='username' id='username' placeholder='username' onChange={handleChange}/>
                    <label htmlFor="password">password: <span className='red'>*</span></label>
                    <input required type="password" name='password' id='password' placeholder='password' onChange={handleChange}/>

                    <button className='login' type='submit'> {t("big-login")} </button>
                </form>
                <div className='asking'>
                {t("id-asking")} <Link to="/register" className='link'> {t("big-register")} </Link>
                </div>
            </fieldset> */}
        </div>
      </div>
    </div>
  )
}

export default Login
