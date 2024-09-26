import React from 'react'
import { FaDollarSign } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { GrPowerCycle } from "react-icons/gr";
import { LuFilePieChart } from "react-icons/lu";
import './adminBanner.css'

const AdminBanner = () => {
  return (
    <div className='admin-banner'>
      <div className="admin-banner-container">

        <div className="box">
            <div className="left">
                <p className='admin-header'>กำไร / ขาดทุน ต่อวัน</p>
                <p className='admin-icon'>$626,025</p>
            </div>
            <div className="right">
                <FaDollarSign />
            </div>
        </div>

        <div className="box">
            <div className="left">
                <p className='admin-header'>ยอดสมัคร</p>
                <p className='admin-icon'>845 user</p>
            </div>
            <div className="right">
                <FiUser />
            </div>
        </div>

        <div className="box">
            <div className="left">
                <p className='admin-header'>ยอด Referral</p>
                <p className='admin-icon'>420 user</p>
            </div>
            <div className="right">
                <GrPowerCycle />
            </div>
        </div>

        <div className="box">
            <div className="left">
                <p className='admin-header'>รายการที่รอ ดำเนินการ</p>
                <p className='admin-icon'>390</p>
            </div>
            <div className="right">
                <LuFilePieChart />
            </div>
        </div>

      </div>
    </div>
  )
}

export default AdminBanner
