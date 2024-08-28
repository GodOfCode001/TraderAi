import React, { useState } from 'react'
import './editProfile.css'

const EditProfile = () => {
  const [selectedMonth, setSelectedMonth] = useState("Month")
  const [selectedDay, setSelectedDay] = useState("Day")
  const [selectedYear, setSelectedYear] = useState("Year")
  const month = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  }
  // console.log(month)

  const days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]

  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = [];

  for (let i = currentYear; i >= startYear; i--) {
    years.push(i);
  }

  const chains = {
    1: "BEP-20",
    2: "ERC-20",
    3: "TRC-20",
    4: "SPL",
    5: "CIP-20",
    6: "NEP-5",
    7: "HRC-20",
    8: "XRC-20",
    9: "FRC-20",
    10: "ARC-20"
  }  

  const banks = {
  1: " ธนาคารกสิกรไทย (Kasikornbank)",
  2:  "ธนาคารกรุงเทพ (Bangkok Bank)",
  3: "ธนาคารไทยพาณิชย์ (Siam Commercial Bank)",
  4: "ธนาคารกรุงไทย (Krung Thai Bank)",
  5: "ธนาคารทหารไทยธนชาต (TMBThanachart Bank หรือ TTB)",
  6: "ธนาคารกรุงศรีอยุธยา (Krungsri Bank)",
  7: "ธนาคารออมสิน (Government Savings Bank)",
  8: "ธนาคารอาคารสงเคราะห์ (Government Housing Bank)",
  9:"ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)",
  10:"ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม (SME Bank)",
  12:"ธนาคารอิสลามแห่งประเทศไทย (Islamic Bank of Thailand)",
  12:"ธนาคารแห่งประเทศไทย (Bank of Thailand)"
  }

  return (
    <div className='edit-profile'>
        <div className="edit-profile-container">


          <div className="form-container">

            <div className="profile-header">
                User profile
            </div>

            <form action="">

              <div className="top-left">
                <label htmlFor="username">Username</label>
                <input type="text" id='username' name='username'/>

                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email'/>

                <label htmlFor="gender" className='gender'>Gender</label>
                <select name="" id="gender">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {/* <input type="text" id='gender' name='gender'/> */}
              </div>

              <div className="top-right">
                <label htmlFor="password">Password</label>
                <input type="password" id='password' name='password'/>

                <label htmlFor="new-password">New Password</label>
                <input type="password" id='new-password' name='new-password'/>
                <p className='recommend'> (4-32 alphabets or numerics)</p>

                <label htmlFor="confirm-pass">Confirm Password</label>
                <input type="text" id='confirm-pass' name='confirm-pass'/>
              </div>

              <div className="bottom-left">
                <label htmlFor="birthday">Birthday</label>
                <div className="select-wrapper">
                  <select name="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} >
                    <option value="Month" disabled>Month</option>
                    {Object.entries(month).map(([key, value]) => (
                      <option key={key} value={key}> {value} </option>  
                    ))}
                  </select>
                  <select name="day" id="day" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                    <option value="Day" disabled>Day</option>
                    {days.map((day) =>  (
                      <option value={day} key={day}> {day} </option>
                    ))}
                  </select>
                  <select name="year" id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="Year" disabled>Year</option>
                    {years.map((year) => (
                      <option value={year} key={year}> {year} </option>
                    ))}
                  </select>
                </div>

                <label htmlFor="address">Address</label>
                <input type="text" id='address' name='address' placeholder='your Address'/>

                <label htmlFor="Country">Country</label>
                <input type="text" id='country' name='country' placeholder='Your Country'/>

              </div>

              <div className="bottom-right">
                  <button className='save-btn'>Save Changes</button>
              </div>

            </form>
          </div>

          {/* crypto-part */}

          <div className="crypto-container">
            <div className="crypto-header">
              Crypto Address
            </div>

            <form action="">

              <div className="crypto-div">
              <label htmlFor="crpyto-chain" className='label'>Chain</label>
              <select name="chains" id="chains">
                <option value="Chains">Chains</option>
                {Object.entries(chains).map(([key, value]) => (
                  <option key={key} value={value}> {value} </option>
                ))}
              </select>
              </div>

              <div className="crypto-div">
                <label htmlFor="crypto" className='label'>Crypto address</label>
              <input type="text" id='crypto' name='crypto'/>
              </div>

              <div className="crypto-div">
                <label htmlFor="confirm-address" className='label'>Confirm Address</label>
              <input type="text" id='confirm-address' name='confirm-address'/>
              <p className='recommend'> please write <span className='black'>Confirm</span> for confirm your crypto address </p>
              </div>

              <div className="crypto-div">
                <button type='submit' className='confirm-btn'>Confirm</button>
              </div>

              <label htmlFor=""></label>

            </form>
          </div>

          <div className="bank-address">
            <div className="bank-header">Bank Address</div>

            <form action="">
               
               <div className="bank-div">
                <label htmlFor="bank-name" className='label'>Bank name</label>
                <select name="bank-name" id="bank-name">
                  <option value="ชื่อธนาคาร">Bank name</option>
                  {Object.entries(banks).map(([key, value]) => (
                    <option key={key} value={value}> {value} </option>
                  ))}
                </select>
               </div>

               <div className="bank-div">

                <div className="label-div">
                <label htmlFor="bank-account" className='label'>Bank Number</label>
                <label htmlFor="bank-account-name" className='label'>Bank account name</label>
                </div>

                <div className="input-div">
                  <input type="text" id='bank-account'  name='bank-account'/>
                  <input type="text" id='bank-account-name'  name='bank-account-name'/>
                </div>

               </div>

               <div className="bank-div">
                  <label htmlFor="photo-confirm-title" className='label'>Book bank confirm</label>
                  <label htmlFor="photo-confirm" className='photo-confirm'>
                      <img src="assets/Remove-111.png" alt="" />
                  </label>
                  <input type="file" id='photo-confirm' name='photo-confirm' style={{display: "none"}}/>
               </div>

              <div className="bank-div">
                <button type='submit' className='confirm-btn'>Confirm</button>
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default EditProfile
