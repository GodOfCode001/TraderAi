import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";
import './resetPassword.css'

const ResetPassword = () => {
  const {t} = useTranslation()

  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  const { resetpassword } = useContext(AuthContext)
  const [inputs, setInputs] = useState({
    password: "",
    tokenHash: token
  })

  const [loading, setLoading] = useState(false)

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setInputs(prev=> ({...prev, [e.target.name]: e.target.value }))
  }

  const validateForm = () => {
    let errors = {};

    if (!inputs.password) {
      errors.password = true;
    }

    if (!inputs.confirmPassword) {
      errors.confirmPassword = true;
    } else if (inputs.confirmPassword !== inputs.password) {
      errors.confirmPassword = true;
    }
    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setLoading(true)
        const res = await resetpassword(inputs)
        console.log(res)
          Swal.fire({
            title: "Email Sent",
            text: `${res.data}`,
            icon: "success",
            timer: 3000
          });
        setLoading(false)
        setTimeout(() => {
          navigate('/login')
        }, 3000);
      } catch (error) {
        if (error) {
          console.log(error)
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error?.response.data}`,
            timer: 5000
          });
          setLoading(false)
          // navigate('/login')
        }
      }

    } else {
      console.log("Form is invalid, please correct the errors");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `โปรดกรอกข้อมูลให้ตรงกัน`,
      });
    }
  }

  return (
    <div className='resetpassword'>

<div className="video-background">
        <video autoPlay muted loop id="bg-video">
          <source src="/assets/bgvideo/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
          </video>
        </div>

      <div className="resetpassword-container">


        <div className="resetpassword-card">



          <div className="right">

            <div className="site-name">
              TraderAi
            </div>
            <div className="header">
              <p>RESET PASSWORD</p>
            </div>

            <form action="" onSubmit={handleSubmit} className='form-div'>

            <div className="inputs-div">

            <div className="inputs">
              <div className="icon"><RiLockPasswordLine /><span className="red">*</span> </div>
              <input required type="password" id="password" name="password" placeholder="Password" onChange={handleChange}/>
            </div>

            <div className="inputs">
              <div className="icon"><RiLockPasswordLine /><span className="red">*</span> </div>
              <input required type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
            </div>


            </div>

            <div className="buttons-div">

            <div className="buttons">

              <button className="confirm-btn resetpassword-btn" type="submit">
               {loading ? <div className='loader'></div> : <p>Reset Password</p>}
              </button>
            </div>
            </div>

            </form>


          </div>

        </div>


      </div>
    </div>
  )
}

export default ResetPassword
