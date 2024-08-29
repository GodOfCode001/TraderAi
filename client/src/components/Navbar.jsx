import React, { useContext, useState } from 'react'
import "./navbar.css"
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { t } = useTranslation();
    const { changeLanguage } = useContext(AuthContext)
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { currentUser, logout } = useContext(AuthContext);
    
    const navigate = useNavigate();

    const dropdown = (e) => {
      setDropdownVisible(!dropdownVisible);
    }

    const register = () => {
      navigate('/register');
    }
    const login = () => {
      navigate('/login');
    }
    const home = () => {
      navigate('/');
    }
    const pricing = () => {
      navigate('/rebate');
    }
    const about = () => {
      navigate('/about');
    }

    const userinfo = () => {
      navigate('/userinfo')
    }

  return (
    <div className="navbar">
      <div className="navbar-container">

        <div className="logo" onClick={home}>
          <div className="img">
            <h3>Trader Ai</h3>
            {/* <img src="" alt="" /> */}
          </div>
        </div>

        <div className="menu">
          <div className="menu-list">
            <ul>
              <li onClick={pricing}> {t("pricing")} </li>
              <li onClick={about}> {t("about")} </li>
              <li> {t("blog")} </li>
              <li className='change-language' onClick={dropdown}>
               {t("change")}
                <div className={`lng-dropdown ${dropdownVisible ? 'visible' : ''}`}>
                  <div className="buttons">
                  <button onClick={() => changeLanguage('en')}>EN</button>
                  <button onClick={() => changeLanguage('th')}>TH</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

            {currentUser && currentUser !== null ? (
            <div className="userinfo-button">
              <button onClick={() => userinfo()} className='btn'> ข้อมูลผู้ใช้ </button>
            </div>

            ): (
              <div className="button">
              <button onClick={login}> {t("login")} </button>
              <button onClick={register}> {t("register")} </button>
            </div>
            )}

        </div>
      </div>
    </div>
  );
}

export default Navbar
