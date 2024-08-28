import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './userSidebar.css'
import { GiHamburgerMenu } from "react-icons/gi";

const UserSidebar = ({ onNavigate, isOpen, toggleSidebar }) => {
    const { t } = useTranslation();
    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // const toggleSidebar = () => {
    //   setIsSidebarOpen(!isSidebarOpen);
    // };

  return (

    <div className='user-sidebar'>
        <div className={`humburger ${isOpen ? '' : 'active'}`} onClick={toggleSidebar}>
         <GiHamburgerMenu />
        </div>
        <div className={`user-sidebar-container ${isOpen ? '' : 'closed'}`}>

        <div className="tier-logo">
            <img src="assets/rank-logo/diamond.png" alt="" />
        </div>

        <div className="user-info">
            <div className="info-1">
                <div className='info-header'> {t("client-id")} </div>
                <div> #00626 </div>
            </div>

            <div className="info-1">
                <div className='info-header'>{t("class")}</div>
                <div> Diamond </div>
            </div>

            <div className="info-1">
                <div className="info-header"> {t("commission")} </div>
                <div> #404 </div>
            </div>
            <div className="info-1">
                <div className="info-header"> {t("referral-code")} </div>
                <div> #1233219085SDFXCVQ </div>
            </div>
            <button className='edit-profile-btn' onClick={() => onNavigate('edit-profile')}> {t("edit-profile")} </button>
        </div>

        <div className="pages-buttons">
          <button className='link-button' onClick={() => onNavigate('trading-statements')}>Trading statement</button>
          <button className='link-button' onClick={() => onNavigate('investment-class')}>Investment class</button>
          <button className='link-button' onClick={() => onNavigate('transaction')}>Transactions history</button>
            <button 
              className='link-button'
              onClick={() => onNavigate('rebate')}>
              Commission
            </button>
            <button className='link-button' onClick={() => onNavigate('faq-policy')}>FAQ / Policy</button>
            {/* <button className='link-button'>Link or button6</button> */}
            <button className='link-button'>Logout</button>
        </div>
      </div>
    </div>

  )
}

export default UserSidebar
