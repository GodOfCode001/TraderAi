import React, { useContext, useState } from "react";
import "./register.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUserGroup } from "react-icons/fa6";



const Register = () => {
  const { t } = useTranslation();
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const search = useLocation().search
  const params = new URLSearchParams(search)
  const ref = params.get('ref')
  // console.log(ref)
  // const ref = location.pathname.split('/')[2]
  // console.log(location)

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referrer: ref ? ref : "",
  });

  // console.log(formValues)

  const [formErrors, setFormErrors] = useState({});

  // console.log(formErrors);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};

    if (!formValues.username) {
      errors.username = true;
    }

    if (!formValues.email) {
      errors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = true;
    }

    if (!formValues.password) {
      errors.password = true;
    }

    if (!formValues.confirmPassword) {
      errors.confirmPassword = true;
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = true;
    }

    // if (!formValues.referrer) {
    //   errors.referrer = true;
    // }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {

      try {
        setLoading(true)
        await register(formValues)
        setLoading(false)
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
        navigate('/')

      } catch (error) {
        setLoading(false)
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });

        if (error?.response.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error?.response.data}`,
            timer: 3000
          });
          setTimeout(() => {
            navigate('/login')
          }, 3000);
        }


      }

    } else {
      // console.log("Form is invalid, please correct the errors");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `โปรดกรอกข้อมูลให้ครบถ้วน`,
      });
    }
  };

  return (
    <div className="register">
      
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
              <h2>ขั้นตอนง่ายๆ ในการเข้าร่วมสมาชิก TraderAI</h2>
            </div>

            <div className="step">
              <div className="icon">
                <p>1</p>
              </div>
              <div className="text">
                <p>ลงทะเบียนโดยใช้อีเมลของคุณ</p>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <p>2</p>
              </div>
              <div className="text">
                <p>กรอกข้อมูลช่องที่มี * สีแดงให้ครบถ้วน</p>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <p>3</p>
              </div>
              <div className="text">
                <p>กรอกแบบฟอร์มสมัครสมาชิกให้เรียบร้อย
                </p>
              </div>
            </div>

            <div className="step">
              <div className="icon">
                <p>4</p>
              </div>
              <div className="text">
                <p>คุณพร้อมแล้ว เริ่มสนุกกับการเติมโตใน TraderAi ตอนนี้</p>
              </div>
            </div>

          </div>

          <div className="right">
            <div className="header">
              <h2>สมัครสมาชิก</h2>
            </div>

            <form action="" onSubmit={handleSubmit}>

            <div className="inputs">
              <div className="icon"><FaRegUser /><span className="red">*</span> </div>
              <input required type="text" id="username" name="username" placeholder="Username" onChange={handleChange}/>
            </div>

            <div className="inputs">
              <div className="icon"><MdOutlineMailOutline /><span className="red">*</span> </div>
              <input required type="email" id="email" name="email" placeholder="Email Address" onChange={handleChange}/>
            </div>

            <div className="inputs">
              <div className="icon"><RiLockPasswordLine /><span className="red">*</span> </div>
              <input required type="password" id="password" name="password" placeholder="Password" onChange={handleChange}/>
            </div>

            <div className="inputs">
              <div className="icon"><RiLockPasswordLine /><span className="red">*</span> </div>
              <input required type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}/>
            </div>

            <div className="inputs">
              <div className="icon"><FaUserGroup /></div>
              <input disabled={ref ? true : false} value={ref ? ref : null} type="text" id="referer" name="referer" placeholder="Referer Code"
              onChange={handleChange} style={ref ? {backgroundColor: "var(--border)", border: "1px solid var(--border)"} : {}}/>
            </div>

            <div className="buttons">
            <div className="asking">
              {t("id-asking")} 
              <Link to="/login" className="link">
                {t("big-login")}
              </Link>
            </div>

              <button className="confirm-btn loading-btn" type="submit">
                {loading ? <div className="loader"></div> : <p>{t("big-register")}</p>}
              
              </button>
            </div>

            </form>


          </div>

          {/* <fieldset>
            <legend>{t("big-register")}</legend>
            <div className="name"> {t("web-name")} </div>
            <div className="welcome"> {t("register-welcome")} </div>
            <form action="" onSubmit={handleSubmit}>
              <label htmlFor="username">
                username: <span className="red">*</span>{" "}
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                value={formValues.username}
                onChange={handleChange}
                className={formErrors.username ? "input-error" : ""}
              />
              <label htmlFor="email">
                email: <span className="red">*</span>
              </label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="email"
                value={formValues.email}
                onChange={handleChange}
                className={formErrors.email ? "input-error" : ""}
              />
              <label htmlFor="password">
                password: <span className="red">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                value={formValues.password}
                onChange={handleChange}
                className={formErrors.password ? "input-error" : ""}
              />
              <label htmlFor="confirmPassword">
                confirm Password: <span className="red">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="confirm Password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "input-error" : ""}
              />
              <label htmlFor="referrer">
                referrer Code: 
              </label>
              <input
                type="text"
                name="referrer"
                id="referrer"
                placeholder="referrer Code"
                value={ref ? ref : formValues.referrer}
                disabled={ref ? true : false}
                onChange={handleChange}
                className={formErrors.referrer ? "input-error" : ""} 
                style={ref ? {backgroundColor: "var(--border)", border: "none"} : {}}
              />
              <button type="submit"> {t("big-register")} </button>
            </form>
              {formErrors && Object.keys(formErrors).length > 0 && (
                <p className="red">Please fill the form correctly</p>
              )}
            <div className="asking">
              {t("id-asking")}{" "}
              <Link to="/login" className="link">
                {" "}
                {t("big-login")}{" "}
              </Link>
            </div>
          </fieldset> */}
        </div>
      </div>
    </div>
  );
};

export default Register;
