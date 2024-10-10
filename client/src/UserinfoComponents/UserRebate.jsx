import React, { useContext, useEffect, useState } from 'react'
import './userRebate.css'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'

const UserRebate = () => {
  const { currentUser, WEB_URL,backend } = useContext(AuthContext)
  const [rebate, setRebate] = useState([])

  const inviteCode = currentUser?.users_referral_code || null
  const inviteLink = WEB_URL + "/register" + "/?ref=" + inviteCode

  const copytoCodeClipboard = () => {    
    const copyText = document.getElementById("invite-code")
    
    copyText.disabled = false;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    
    document.execCommand("copy");
    
    copyText.disabled = true;
    const popup = document.getElementById("popup-notification");
    popup.style.display = 'block';  // Make the popup visible
    popup.style.opacity = '1';       // Start with full opacity
  
    // Hide the popup after a short delay
    setTimeout(() => {
      popup.style.opacity = '0'; // Start fading out
  
      // After the transition ends, set display to none
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300); // Match this delay to the transition duration (300ms)
    }, 500); // Show for 2 seconds before fading out // Hide after 2 seconds
  }

  const copytoLinkClipboard = () => {    
    const copyText = document.getElementById("invite-link")
    
    copyText.disabled = false;
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    
    document.execCommand("copy");
    
    copyText.disabled = true;
    const popup = document.getElementById("popup-notification");
    popup.style.display = 'block';  // Make the popup visible
    popup.style.opacity = '1';       // Start with full opacity
  
    // Hide the popup after a short delay
    setTimeout(() => {
      popup.style.opacity = '0'; // Start fading out
  
      // After the transition ends, set display to none
      setTimeout(() => {
        popup.style.display = 'none';
      }, 300); // Match this delay to the transition duration (300ms)
    }, 500); // Show for 2 seconds before fading out // Hide after 2 seconds
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/rebate`, {
          withCredentials: true
        })
        console.log(res.data[0])
        setRebate(res.data[0])
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className='user-rebate'>
      <div className="user-rebate-container">
        <div className="top">

          <div className="left">
            <div className="left-header">Rank Details</div>
            <div className="one">
              <p>ขั้นที่ 1 :</p>
              <p> {rebate.Level1Commission}% </p>
            </div>
            <div className="two">
            <p>ขั้นที่ 2 :</p>
            <p> {rebate.Level2Commission}% </p>
            </div>
            <div className="three">
            <p>ขั้นที่ 3 :</p>
            <p> {rebate.Level3Commission}% </p>
            </div>

            <div className="total">
              <p>ทั้งหมด</p>
              <p>{rebate.wallet_main_wallet} USDT</p> 
            </div>
          </div>

          <div className="right">
            <div className="code">
              <div className='code-header'>My code</div>
              <input type="text" id='invite-code' name='invite-code' disabled value={inviteCode} />
              <button className='copy-btn' onClick={copytoCodeClipboard}> Copy </button>
              {/* <span id="copy-notification" style={{display: "none", marginLeft: "10px", color: "green", position: "absolute", top: "150px"}}>Copied!</span> */}
              <div id="popup-notification">
  Copied!
</div>
            </div>

            <div className="link">
              <div className='link-header'>Invite link</div>
              <input type="text" id='invite-link' name='invite-link' disabled value={inviteLink}/>
              <button className='copy-btn' onClick={copytoLinkClipboard}> Copy </button>
            </div>
          </div>

        </div>

        <div className="bottom">

          <div className="boxes">
            <div className="top-box">
              <p>My reabte class</p>
              <p style={{textTransform: "uppercase"}}> # <span className='rank-name' style={{background: `var(--${currentUser?.users_class})`, color: "transparent", backgroundClip: "text", textTransform: 'uppercase', fontWeight: "bold"}}>{currentUser?.users_class ? currentUser.users_class : null} </span> </p>
            </div>

            <div className="bototm-box">
            <p>My basic rebate rate</p>
            <p># <span className='user-get'>{rebate.PartnerSharePercentage}</span> : <span>{rebate.CompanySharePercentage}</span> </p>
            </div>
          </div>

          <div className="boxes">
            <div className="top-box">
              <p>My reabte rate</p>
              <p># <span className='user-get'>{rebate.PartnerSharePercentage}</span> : <span>{rebate.CompanySharePercentage}</span></p>
            </div>

            <div className="bototm-box">
            <p>Next basic rebate rate</p>
            <p># <span className='user-get'>{rebate.PartnerSharePercentage + 5}</span> : <span>{rebate.CompanySharePercentage -5 }</span></p>
            </div>
          </div>

          <div className="boxes">
            <div className="top-box">
              <p>Registered</p>
              <p># {rebate.registeredCount}</p>
            </div>

            <div className="bototm-box">
            <p>Total invited amount</p>
            <p># {rebate.registeredCount}</p>
            </div>
          </div>

          <div className="boxes">
            <div className="top-box">
              <p>Started Trading</p>
              <p>#</p>
            </div>

            <div className="bototm-box">
            <p>Withdraw Volume</p>
            <p># {rebate.total_team_withdrawals} USDT </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserRebate
