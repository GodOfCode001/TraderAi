import React, { useContext, useState } from 'react'
import './forgetPassword.css'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";

const ForgetPassword = () => {

  const {t} = useTranslation()

    const { forgetpassword } = useContext(AuthContext)
    const [inputs, setInputs] = useState({
      email: ""
    })
    const [loading, setLoading] = useState(false)

    const [formErrors, setFormErrors] = useState({});

    const handleChange = (e) => {
      setInputs(prev=> ({...prev, [e.target.name]: e.target.value }))
    }

    const navigate = useNavigate()

    const validateForm = () => {
      let errors = {};
  
      if (!inputs.email) {
        errors.email = true;
      } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
        errors.email = true;
      }
  
      setFormErrors(errors);
  
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault()

      if (validateForm()) {

        try {
          setLoading(true)
          const res = await forgetpassword(inputs)
          // console.log(res)
          Swal.fire({
            title: "Email Sent",
            text: `${res?.data}`,
            icon: "success"
          });
          setLoading(false)
        } catch (error) {
          if (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `${error}`,
              timer: 5000
            });
            // navigate('/login')
          }
        }
      } else {
        console.log("Form is invalid, please correct the errors");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `โปรดกรอกข้อมูลให้ครบถ้วน`,
        });
      }
    }
    
  return (
    <div className='forgetpassword'>

<div className="video-background">
        <video autoPlay muted loop id="bg-video">
          <source src="/assets/bgvideo/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
          </video>
        </div>

      <div className="forgetpassword-container">


        <div className="forgetpassword-card">



          <div className="right">

            <div className="site-name">
              TraderAi
            </div>
            <div className="header">
              <p>FORGET PASSWORD</p>
            </div>

            <form action="" onSubmit={handleSubmit} className='form-div'>

            <div className="inputs-div">

            <div className="inputs">
              <div className="icon"><MdOutlineMailOutline /><span className="red">*</span> </div>
              <input required type="email" id="email" name="email" placeholder="Email Address" onChange={handleChange}/>
            </div>

            <div className="forget-password">
            Please enter your email address. Reset password email will be sent.
            </div>

            </div>

            {formErrors && Object.keys(formErrors).length > 0 && (
                <p className="red">Please fill the form correctly</p>
              )}

            <div className="buttons-div">

            <div className="buttons">

              <button className="confirm-btn forgetpassword-btn" type="submit">
                {loading ? <div className="loader"></div> : <p>Reset Password</p>}
                {/* Reset Password */}
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

export default ForgetPassword
