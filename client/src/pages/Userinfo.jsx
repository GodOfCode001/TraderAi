import React, { useState } from 'react'
import UserSidebar from '../components/UserSidebar'
import './userinfo.css'
import UserMain from '../UserinfoComponents/UserMain'
import UserRebate from '../UserinfoComponents/UserRebate'
import InvestmentClass from '../UserinfoComponents/InvestmentClass'
import Transactions from '../UserinfoComponents/Transactions'
import FAQPolicy from '../UserinfoComponents/FAQPolicy'
import TradingStatement from '../UserinfoComponents/TradingStatement'
import EditProfile from '../UserinfoComponents/EditProfile'

const Userinfo = () => {
  const [activeComponent, setActiveComponent] = useState('main'); // Default is UserMain
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`userinfo ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="userinfo-container">
            <UserSidebar onNavigate={handleNavigation} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {activeComponent === 'main' && <UserMain isOpen={!isSidebarOpen}/>}
            {activeComponent === 'rebate' && <UserRebate />}
            {activeComponent === 'investment-class' && <InvestmentClass />}
            {activeComponent === 'transaction' && <Transactions />}
            {activeComponent === 'faq-policy' && <FAQPolicy />}
            {activeComponent === 'trading-statements' && <TradingStatement />}
            {activeComponent === 'edit-profile' && <EditProfile />}
        </div>
    </div>
  )
}

export default Userinfo
