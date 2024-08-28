import React from 'react'
import './userRebate.css'

const UserRebate = () => {
  const inviteCode = "ASDSDZXCKN123127105"
  const inviteLink = "www.example.com/ASDSDZXCKN123127105"
  return (
    <div className='user-rebate'>
      <div className="user-rebate-container">
        <div className="top">

          <div className="left">
            <div className="left-header">Rank Details</div>
            <div className="one">
              <p>ขั้นที่ 1 :</p>
              <p> 3% </p>
            </div>
            <div className="two">
            <p>ขั้นที่ 2 :</p>
            <p> 2% </p>
            </div>
            <div className="three">
            <p>ขั้นที่ 3 :</p>
            <p> 1% </p>
            </div>

            <div className="total">
              <p>ทั้งหมด</p>
              <p>150 USDT</p> 
            </div>
          </div>

          <div className="right">
            <div className="code">
              <div className='code-header'>My code</div>
              <input type="text" id='invite-code' name='invite-code' disabled value={inviteCode}/>
              <button className='copy-btn'> Copy </button>
            </div>
            <div className="link">
              <div className='link-header'>Invite link</div>
              <input type="text" id='invite-link' name='invite-link' disabled value={inviteLink}/>
              <button className='copy-btn'> Copy </button>
            </div>
          </div>

        </div>

        <div className="bottom">

          <div className="boxes">
            <div className="top-box">
              <p>My reabte class</p>
              <p>Diamond</p>
            </div>

            <div className="bototm-box">
            <p>My basic rebate rate</p>
            <p>#</p>
            </div>
          </div>

          <div className="boxes">
            <div className="top-box">
              <p>My reabte rate</p>
              <p>#</p>
            </div>

            <div className="bototm-box">
            <p>Next basic rebate rate</p>
            <p>#</p>
            </div>
          </div>

          <div className="boxes">
            <div className="top-box">
              <p>Registered</p>
              <p>#</p>
            </div>

            <div className="bototm-box">
            <p>Total invited amount</p>
            <p>#</p>
            </div>
          </div>

          <div className="boxes">
            <div className="top-box">
              <p>Started Trading</p>
              <p>#</p>
            </div>

            <div className="bototm-box">
            <p>Withdraw Volume</p>
            <p>#</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserRebate
