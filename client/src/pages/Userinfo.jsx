import React, { useContext, useEffect, useState } from 'react'
import UserSidebar from '../components/UserSidebar'
import './userinfo.css'
import UserMain from '../UserinfoComponents/UserMain'
import UserRebate from '../UserinfoComponents/UserRebate'
import InvestmentClass from '../UserinfoComponents/InvestmentClass'
import Transactions from '../UserinfoComponents/Transactions'
import FAQPolicy from '../UserinfoComponents/FAQPolicy'
import TradingStatement from '../UserinfoComponents/TradingStatement'
import EditProfile from '../UserinfoComponents/EditProfile'
import { AuthContext } from '../context/AuthContext'
import { replace, useNavigate, useLocation } from 'react-router-dom'

const Userinfo = () => {
  const [activeComponent, setActiveComponent] = useState('main'); // Default is UserMain
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser } = useContext(AuthContext)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const page = searchParams.get('p')


  const handleNavigation = (page) => {
    setActiveComponent(page);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser && currentUser === null) {
      return navigate('/login');
    }
    
  }, [currentUser])

  return (
    <div className={`userinfo ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="userinfo-container">
            <UserSidebar onNavigate={handleNavigation} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {page === 'mainscreen' && <UserMain isOpen={!isSidebarOpen}/>}
            {page === 'commission' && <UserRebate />}
            {page === 'investment-class' && <InvestmentClass />}
            {page === 'transaction' && <Transactions />}
            {page === 'faq-policy' && <FAQPolicy />}
            {page === 'trading-statements' && <TradingStatement />}
            {page === 'edit-profile' && <EditProfile />}
        </div>
    </div>
  )
}

export default Userinfo
