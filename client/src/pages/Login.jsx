import React, { useContext, useState } from 'react'
import './register.css'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';


const Login = () => {
    const {t} = useTranslation()
    const { login, logout } = useContext(AuthContext)
    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")
    const [inputs, setInputs] = useState({
      username: "",
      password: "",
    })

    // console.log(inputs)

    const handleChange = (e) => {
      setInputs(prev=> ({...prev, [e.target.name]: e.target.value }))
    }

    // const logout = async () => {
    //   const res = await axios.post('/api/auth/logout')
    //   if (res.status === 200) {
    //     localStorage.clear();
    //   }
    //   console.log(res)
    // }

    // logout()
    const navigate = useNavigate()


    // const autoLogout = () => {
    //     const token = Cookies.get('access_token');
    //     return console.log(token)
    // }

    // autoLogout();

//     const autoLogout = () => {
//     const token = Cookies.get('access_token');
//     console.log(token);  // ตรวจสอบว่าค่าถูกต้องหรือไม่
// }

// autoLogout();


    const handleSubmit = async (e) => {
      e.preventDefault()
      if (inputs.username === "") {
        alert("Please enter a username")
      }

      if (inputs.password === "") {
        alert("Please enter a password")
      }
      try {
        console.log("going to login")
        await login(inputs)
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
        // navigate("/")
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <div className='register'>
      <div className="register-container">
        <div className="register-card">
            <fieldset>
                <legend> {t("big-login")} </legend>
                <div className="name">{t("web-name")}</div>
                <div className='welcome'>{t("login-welcome")}</div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">username: <span className='red'>*</span> </label>
                    <input required type="text" name='username' id='username' placeholder='username' onChange={handleChange}/>
                    <label htmlFor="password">password: <span className='red'>*</span></label>
                    <input required type="text" name='password' id='password' placeholder='password' onChange={handleChange}/>

                    <button className='login' type='submit'> {t("big-login")} </button>
                </form>
                <div className='asking'>
                {t("id-asking")} <Link to="/register" className='link'> {t("big-register")} </Link>
                </div>
            </fieldset>
        </div>
      </div>
    </div>
  )
}

export default Login
