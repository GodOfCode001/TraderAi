import React from 'react'
import './adminSettingsCom.css'
import { PiLockKeyOpenBold } from "react-icons/pi";
import { IoLogoBuffer } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";

const AdminSettingsCom = () => {
  return (
    <div className='admin-settings-com'>
      <div className="admin-settings-com-container">

        <div className="top">
            <div className="top-header">
                <p>Security and website configuration</p>
            </div>

            <div className="settings-com">
                <div className="left">
                    <div className="icons">
                        <img src="/assets/coin/usdt.png" alt="usdt coin" />
                    </div>

                    <div className="text">
                        <div className="header">Crypto address</div>
                        <div className="description">way to add payment method to this website.</div>
                    </div>
                </div>

                <div className="right">
                    <button>Edit Address</button>
                </div>
            </div>

            <div className="settings-com">
                <div className="left">
                    <div className="icons">
                        <img src="/assets/topup/slipscanpay.png" alt="" />
                    </div>

                    <div className="text">
                        <div className="header">Bank information</div>
                        <div className="description">way to add payment method to this website.</div>
                    </div>
                </div>

                <div className="right">
                    <button>Edit Account</button>
                </div>
            </div>

            <div className="settings-com">
                <div className="left">
                    <div className="icons">
                     <PiLockKeyOpenBold className='icon'/>
                    </div>

                    <div className="text">
                        <div className="header">Login Password</div>
                        <div className="description">Login password in used to login to your account.</div>
                    </div>
                </div>

                <div className="right">
                    <button>Edit Password</button>
                </div>
            </div>

        </div>

        <div className="top">
            <div className="top-header">
                <p className='second'>User information</p>
            </div>

            <div className="settings-com">
                <div className="left">
                    <div className="icons">
                    <FaRegUser className="icon"/>
                    </div>

                    <div className="text">
                        <div className="header">User information</div>
                        <div className="description">way to add payment method to this website.</div>
                    </div>
                </div>

                <div className="right">
                    <button>Check user</button>
                </div>
            </div>

            <div className="settings-com">
                <div className="left">
                    <div className="icons">
                    <IoLogoBuffer className="icon"/>
                    </div>

                    <div className="text">
                        <div className="header">Web logo</div>
                        <div className="description">way to change logo for this website.</div>
                    </div>
                </div>

                <div className="right">
                    <button>Edit logo</button>
                </div>
            </div>

            <div className="settings-com">
                <div className="left">
                    <div className="icons">
                    <PiLockKeyOpenBold className='icon'/>
                    </div>

                    <div className="text">
                        <div className="header">Login Password</div>
                        <div className="description">Login password in used to login to your account.</div>
                    </div>
                </div>

                <div className="right">
                    <button>Edit Password</button>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}

export default AdminSettingsCom
