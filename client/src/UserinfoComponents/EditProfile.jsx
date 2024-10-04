import React, { useContext, useEffect, useState } from 'react'
import './editProfile.css'
import Swal from 'sweetalert2'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

const EditProfile = () => {

  function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  }

  const [selectedMonth, setSelectedMonth] = useState("Month")
  const [selectedDay, setSelectedDay] = useState("Day")
  const [selectedYear, setSelectedYear] = useState("Year")
  const { backend } = useContext(AuthContext)
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
  1: "ธนาคารกสิกรไทย (Kasikorn Bank)",
  2: "ธนาคารกรุงเทพ (Bangkok Bank)",
  3: "ธนาคารไทยพาณิชย์ (Siam Commercial Bank)",
  4: "ธนาคารกรุงไทย (Krung Thai Bank)",
  5: "ธนาคารทหารไทยธนชาต (TMBThanachart Bank หรือ TTB)",
  6: "ธนาคารกรุงศรีอยุธยา (Krungsri Bank)",
  7: "ธนาคารออมสิน (Government Savings Bank)",
  8: "ธนาคารอาคารสงเคราะห์ (Government Housing Bank)",
  9: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (BAAC)",
  10:"ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม (SME Bank)",
  12:"ธนาคารอิสลามแห่งประเทศไทย (Islamic Bank of Thailand)",
  12:"ธนาคารยูโอบี (UOB)"
  }

  const [isEditable,  setIsEditAble] = useState(false)
  const [chain, setChain] = useState('')
  const [crypto, setCrypto] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleUpdateClick = () => {
    setIsEditAble(true)
  }

  const handleProfileClick = () => {
    setUserEdit(true)
  }
 
  // crpyto address

  const [user, setUser] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [gender, setGender] = useState('')
  const [birthday, setBirthday] = useState('')
  const [address, setAddress] = useState('')
  const [country, setCountry] = useState('')
  const [userEdit, setUserEdit] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${backend}/api/user/get-crypto`, {
        withCredentials: true
      })

      const data = res.data[0]
      setChain(data.UCW_chain)
      setCrypto(data.UCW_address)
    }

    fetchData()
  }, [])

  // get user Profile

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user/get-profile`, {
          withCredentials: true
        })
        const data = res.data
        // console.log(data)
        const birthday = data.users_birthday
        // console.log(birthday)
        if (birthday) {
          const date = new Date(birthday)
          const year = date.getFullYear()
          const month = (date.getMonth() + 1).toString().padStart(2, '0')
          const day = date.getDate().toString().padStart(2, '0')
          setSelectedDay(day)
          setSelectedMonth(month)
          setSelectedYear(year)
        }
        // console.log(data)
        setUser(data.users_username)
        setEmail(data.users_email)
        setGender("gender")
        setBirthday(data.users_birthday || null)
        const unsanAddress = decodeHtmlEntities(data.users_address)
        setAddress(unsanAddress || null)
        setCountry(data.users_country || null)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  // handleSubmit

  const handleSubmitProfile = async (e) => {
    e.preventDefault()

    const birthdaySeting = `${selectedYear}-${selectedMonth}-${selectedDay}`

    if (!user || !email || !gender || !selectedYear || !selectedMonth || !selectedDay || !address || !country) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Please fill out the information completely",
      });
      return
    }

    if (password) {
      if (confirmNewPassword !== newPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "New password not match, Please try again!",
        });
        return
      }

      try {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, update it!"
        }).then(async (result) => {
          if (result.isConfirmed) {
  
            try {
              const res = await axios.post(`${backend}/api/user/update-profile`, {
                user: user,
                email: email,
                gender: gender,
                birthday: birthdaySeting,
                address: address,
                country: country,
                password: password,
                newPassword: newPassword
              }, {withCredentials: true})
    
              if (res.status === 200) {
                Swal.fire({
                  title: "Updated!",
                  text: "Your address has been updated.",
                  icon: "success",
                  timer: 1500
                });
              } else {
                Swal.fire({
                  title: "Updated!",
                  text: "Your address has been updated.",
                  icon: "success",
                  timer: 1500
                });
              }
              setTimeout(() => {
                window.location.reload()
              }, 1500)
  
            } catch (error) {
              console.log(error)
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response.data || "Something went wrong!",
              });
            }
  
            setUserEdit(false)
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: {error},
        });
      }
      return
    }

    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!"
      }).then(async (result) => {
        if (result.isConfirmed) {

          try {
            const res = await axios.post(`${backend}/api/user/update-profile`, {
              user: user,
              email: email,
              gender: gender,
              birthday: birthdaySeting,
              address: address,
              country: country,
            }, {withCredentials: true})
  
            if (res.status === 200) {
              Swal.fire({
                title: "Updated!",
                text: "Your address has been updated.",
                icon: "success",
                timer: 1500
              });
            } else {
              Swal.fire({
                title: "Updated!",
                text: "Your address has been updated.",
                icon: "success",
                timer: 1500
              });
            }
            setTimeout(() => {
              window.location.reload()
            }, 1500)

          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }

          setUserEdit(false)
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: {error},
      });
      setUserEdit(false)
    }
    

    // setUserEdit(false)
  }



  const handleCrypto = async (e) => {
    e.preventDefault()

    if (confirm.toLowerCase() !== 'confirm') {
      Swal.fire({
        title: "confirm?",
        text: "Please type confirm",
        icon: "question"
      });
      return
    }

    try {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, update it!"
      }).then(async (result) => {
        if (result.isConfirmed) {

          try {
            const res = await axios.post(`${backend}/api/user/update-crypto`, {
              chain: chain,
              address: crypto
            }, {withCredentials: true})
  
            if (res.status === 200) {
              Swal.fire({
                title: "Updated!",
                text: "Your address has been updated.",
                icon: "success",
                timer: 1500
              });
            } else {
              Swal.fire({
                title: "Updated!",
                text: "Your address has been updated.",
                icon: "success",
                timer: 1500
              });
            }
            setTimeout(() => {
              window.location.reload()
            }, 1500)

          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }

          setIsEditAble(false)
        }
      });


    } catch (error) {
      console.log(error)
    }
  }

  // Bank section

  const [bankEdit, setBankEdit] = useState(false)
  const [account, setAccount] = useState('')
  const [accountName, setAccountName] = useState('')
  const [bankName, setBankName] = useState('')
  const [fileId, setFileId] = useState('')
  const [file , setFile] = useState(null)

  const handleEditBank = () => {
    setBankEdit(true)
  }
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user/get-bank`, {
          withCredentials: true
        })
        const data = res.data[0]
        console.log(data)
        setAccount(data.UBW_account)
        setAccountName(data.UBW_bank_account_name)
        const unSanBankName = decodeHtmlEntities(data.UBW_bank_name)
        setBankName(unSanBankName)
        setFileId(data.UBW_img_path)
        // console.log(unSanBankName)
      } catch (error) {
        
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops",
        //   text: error.response.data,
        // });
      }
    }
    fetchData()
  }, [])

  const handleSubmitBank = (e) => {
    e.preventDefault()

    if (!account || !accountName || !bankName) {
      Swal.fire({
        title: "fails!",
        text: "Please fill completely",
        icon: "error"
      });
      return
    }

    console.log("Hello")
    const formData = new FormData()
    formData.append('account', account)
    formData.append('accountName', accountName)
    formData.append('bankName', bankName)
    formData.append('fileId', fileId)
    if (file) {
      formData.append('bookBank', file)
    }
    
    console.log(formData)

    if (!fileId) {
      if (!file) {
        Swal.fire({
          title: "fails!",
          text: "Please upload your bookBank",
          icon: "error"
        });
        return
      }
    }
    

    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await axios.post(`${backend}/api/user/update-bank`, formData, {
              withCredentials: true
            })
            Swal.fire({
              title: "Updated!",
              text: "Your bookBank has been updated.",
              icon: "success",
              timer: 1500
            });
            setTimeout(() => {
              window.location.reload()
            }, 1500);
          } catch (error) {
            Swal.fire({
              title: "fails!",
              text: error.response.data,
              icon: "error"
            });
          }
          setBankEdit(false)
        }
      });



    } catch (error) {
      Swal.fire({
        title: "fails!",
        text: error.response.data,
        icon: "error"
      });
    }
  
  }

  // console.log(bankName)

  return (
    <div className='edit-profile'>
        <div className="edit-profile-container">


          <div className="form-container">

            <div className="profile-header">
                User profile
            </div>

            <form action="" onSubmit={handleSubmitProfile}>

              <div className="top-left">
                <label htmlFor="username">Username</label>
                <input type="text" id='username' name='username' value={user} onChange={(e) => setUser(e.target.value)} disabled={!userEdit}/>

                <label htmlFor="email">Email</label>
                <input type="email" id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} disabled={!userEdit}/>

                <label htmlFor="gender" className='gender'>Gender</label>
                <select name="gender" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} disabled={!userEdit}>
                <option value="gender" disabled>Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {/* <input type="text" id='gender' name='gender'/> */}
              </div>

              <div className="top-right">
                <label htmlFor="password">Password</label>
                <input type="password" id='password' name='password' onChange={(e) => setPassword(e.target.value)} disabled={!userEdit} placeholder='ใส่รหัสผ่าน (หากต้องการเปลี่ยน)'/>

                <label htmlFor="new-password">New Password</label>
                <input type="password" id='new-password' name='new-password' onChange={(e) => setNewPassword(e.target.value)} disabled={!userEdit} placeholder='ใส่รหัสผ่านใหม่ (หากต้องการเปลี่ยน)'/>
                <p className='recommend'> (4-32 alphabets or numerics)</p>

                <label htmlFor="confirm-pass">Confirm Password</label>
                <input type="text" id='confirm-pass' name='confirm-pass' onChange={(e) => setConfirmNewPassword(e.target.value)} disabled={!userEdit} placeholder='ยืนยันรหัสผ่านใหม่ (หากต้องการเปลี่ยน)'/>
              </div>

              <div className="bottom-left">
                <label htmlFor="birthday">Birthday</label>
                <div className="select-wrapper">
                  <select name="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} disabled={!userEdit}>
                    <option value="Month" disabled>Month</option>
                    {Object.entries(month).map(([key, value]) => (
                      <option key={key} value={key}> {value} </option>  
                    ))}
                  </select>
                  <select name="day" id="day" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} disabled={!userEdit}>
                    <option value="Day" disabled>Day</option>
                    {days.map((day) =>  (
                      <option value={day} key={day}> {day} </option>
                    ))}
                  </select>
                  <select name="year" id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} disabled={!userEdit}>
                    <option value="Year" disabled>Year</option>
                    {years.map((year) => (
                      <option value={year} key={year}> {year} </option>
                    ))}
                  </select>
                </div>

                <label htmlFor="address">Address</label>
                <input type="text" id='address' name='address' placeholder='your Address' value={address} onChange={(e) => setAddress(e.target.value)} disabled={!userEdit}/>

                <label htmlFor="Country">Country</label>
                <input type="text" id='country' name='country' placeholder='Your Country' value={country} onChange={(e) => setCountry(e.target.value)} disabled={!userEdit}/>

              </div>

              <div className="bottom-right">
                  <button className={userEdit ? "confirm-btn" : "disable-btn"} type='submit'>Save Changes</button>
                  {!userEdit && (
                    <button className='update-btn' onClick={handleProfileClick}>Update</button>
                  )}
              </div>

            </form>
          </div>

          {/* crypto-part */}

          <div className="crypto-container">
            <div className="crypto-header">
              Crypto Address
            </div>

            <form action="" onSubmit={handleCrypto}>

              <div className="crypto-div">
              <label htmlFor="crpyto-chain" className='label'>Chain</label>
              <select name="chains" id="chains" value={chain} onChange={(e) => setChain(e.target.value)} disabled={!isEditable}>
                <option value="Chains" >Chains</option>
                {Object.entries(chains).map(([key, value]) => (
                  <option key={key} value={value}> {value} </option>
                ))}
              </select>
              </div>

              <div className="crypto-div">
                <label htmlFor="crypto" className='label'>Crypto address</label>
              <input type="text" id='crypto' name='crypto' onChange={(e) => setCrypto(e.target.value)} value={crypto} disabled={!isEditable}/>
              </div>

              <div className="crypto-div">
                <label htmlFor="confirm-address" className='label'>Confirm Address</label>
              <input type="text" id='confirm-address' name='confirm-address' onChange={(e) => setConfirm(e.target.value)} disabled={!isEditable}/>
              <p className='recommend'> please write <span className='black'>Confirm</span> for confirm your crypto address </p>
              </div>

              <div className="crypto-div buttons-div">
                <button type='submit' className={isEditable ? "confirm-btn" : "disable-btn"} disabled={!isEditable}>Confirm</button>

                {!isEditable && (
                  <button onClick={handleUpdateClick} className='update-btn'>Update</button>
                )}
              </div>



              {/* <label htmlFor=""></label> */}

            </form>
          </div>

          <div className="bank-address">
            <div className="bank-header">Bank Address</div>

            <form action="" onSubmit={handleSubmitBank}>
               
               <div className="bank-div">
                <label htmlFor="bank-name" className='label'>Bank name</label>
                <select name="bank-name" id="bank-name" value={bankName} onChange={(e) => setBankName(e.target.value)} disabled={!bankEdit}>
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
                  <input type="text" id='bank-account' name='bank-account' value={account} onChange={(e) => setAccount(e.target.value)} disabled={!bankEdit}/>
                  <input type="text" id='bank-account-name'  name='bank-account-name' value={accountName} onChange={(e) => setAccountName(e.target.value)} disabled={!bankEdit}/>
                </div>

               </div>

               <div className="bank-div">
                  <label htmlFor="photo-confirm-title" className='label'>Book bank confirm</label>
                  <label htmlFor="photo-confirm" className='photo-confirm'>

                    {!bankEdit ? (
                      fileId ? (
                          <iframe
                            src={`https://drive.google.com/file/d/${fileId}/preview`}
                            width="403" // adjust as needed
                            height="240" // adjust as needed
                            frameBorder="0"
                            allowFullScreen>
                          </iframe>) : (<img src={file ? URL.createObjectURL(file) : "assets/Remove-111.png"} alt="" />)
                      
                    ) : (
                      <img src={file ? URL.createObjectURL(file) : "assets/Remove-111.png"} alt="" />
                    )}
                      {/* <img src={file ? URL.createObjectURL(file) : "assets/Remove-111.png"} alt="" /> */}
                  </label>
                  <input type="file" id='photo-confirm' name='photo-confirm' style={{display: "none"}} onChange={(e) => setFile(e.target.files[0])} disabled={!bankEdit}/>
               </div>

              <div className="bank-div">
                <button type='submit' className={bankEdit ? "confirm-btn" : "disable-btn"} disabled={!bankEdit}>Confirm</button>
                {!bankEdit && (
                  <button onClick={handleEditBank} className='update-btn'>Update</button>
                )}
              </div>
            </form>
          </div>
        </div>
    </div>
  )
}

export default EditProfile
