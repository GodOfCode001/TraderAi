import React, { useContext, useState } from 'react'
import "./navbar.css"
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

  return (
    <div className="navbar">
      <div className="navbar-container">

        <Link className="logo link" to="/">
          <div className="img">
            <h3>Trader Ai</h3>
            {/* <img src="" alt="" /> */}
          </div>
        </Link>

        <div className="menu">
          <div className="menu-list">
            <ul>
              <li> <Link to="/rebate" className="link"> {t("pricing")} </Link> </li>
              <li> <Link to="/about" className="link"> {t("about")} </Link> </li>
              <li> <Link to="/blog?category=all&page=1" className="link"> {t("blog")} </Link> </li>
              <li className='change-language link' onClick={dropdown}>
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
              <Link to="/userinfo?p=mainscreen"  className='btn link'> ข้อมูลผู้ใช้ </Link>
            </div>

            ): (
              <div className="button">
              <Link to="/login" className="link link-btn"> {t("login")} </Link>
              <Link to="/register" className="link link-btn"> {t("register")} </Link>
            </div>
            )}

        </div>
      </div>
    </div>
  );
}

export default Navbar
