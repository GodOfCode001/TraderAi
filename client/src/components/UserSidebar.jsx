import React, { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import './userSidebar.css'
import { GiHamburgerMenu } from "react-icons/gi";
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'


const UserSidebar = ({ onNavigate, isOpen, toggleSidebar }) => {
    const { t } = useTranslation();
    const { currentUser, logout } = useContext(AuthContext)

  return (

    <div className='user-sidebar'>
        <div className={`humburger ${isOpen ? '' : 'active'}`} onClick={toggleSidebar}>
         <GiHamburgerMenu />
        </div>
        <div className={`user-sidebar-container ${isOpen ? '' : 'closed'}`}>

        <Link className="tier-logo" to="/userinfo/?p=mainscreen">
            <img src={`/assets/rank-logo/${currentUser?.users_class}.png`} alt="" />
        </Link>

        <div className="user-info">
            <div className="info-1">
                <div className='info-header'> {t("client-id")} </div>
                <div># {currentUser?.users_id} </div>
            </div>

            <div className="info-1">
                <div className='info-header'>{t("class")}</div>
                <div style={{textTransform: "uppercase"}}> # {currentUser?.users_class} </div>
            </div>

            <div className="info-1">
                <div className="info-header"> {t("commission")} </div>
                <div> #404 </div>
            </div>
            <div className="info-1">
                <div className="info-header"> {t("referral-code")} </div>
                <div> {currentUser?.users_referral_code} </div>
            </div>
            <Link className='edit-profile-btn link' to="/userinfo/?p=edit-profile"> {t("edit-profile")} </Link>
        </div>

        <div className="pages-buttons">
          <Link className='link-button link' to="/userinfo/?p=trading-statements">Trading statement</Link>
          <Link className='link-button link' to="/userinfo/?p=investment-class">Investment class</Link>
          <Link className='link-button link' to="/userinfo/?p=transaction">Transactions history</Link>
            <Link 
              className='link-button link'
              to="/userinfo/?p=commission">
              Commission
            </Link>
            <Link className='link-button link' to="/userinfo/?p=faq-policy">FAQ / Policy</Link>
            {/* <button className='link-button'>Link or button6</button> */}
            <button className='link-button link' onClick={() => logout()}>Logout</button>
        </div>
      </div>
    </div>

  )
}

export default UserSidebar
