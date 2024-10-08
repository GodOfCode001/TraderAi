import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import './bankDeposit.css'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom'
import IsLoading from '../components/IsLoading';
const BankWithdraw = () => {

    const { t } = useTranslation();

    const [value, setValue] = useState(0);
    const [gotValue, setGotValue] = useState(0);
    const { backend, setCurrentUser } = useContext(AuthContext)
    const location = useLocation()
    const cat = location.search

    // query Commission

    const [partnerShare, setPartnerShare] = useState()

    useEffect(() => {
      const fetchData = async () => {
        const res = await axios.get(`${backend}/api/user-wallet/get-commission`, {
          withCredentials: true
        })
        console.log("commission is:", res.data)
        setPartnerShare(res?.data[0].PartnerSharePercentage)
      }
      fetchData()
    }, [])

    // query currency_rate

    const [rate, setRate] = useState()

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${backend}/api/currency/get-thb-rate${cat}`, {
            withCredentials: true
          })
          const data = res.data[0]
          // console.log(res.data)
          setRate(data.currency_rate)
          console.log(data.currency_rate)
        } catch (err) {
          if (err.response.status === 403) {
            localStorage.clear()
            setCurrentUser(null)
          }
          console.log("error", err)
        }

      }
      fetchData()
    }, [cat])
    
    const handleInput = (e) => {
    // Remove leading zeros and ensure the value is positive

    // Get the user's input value (Baht amount)
    const inputValue = e.target.value.replace(/^0+/, '') || '0';

    if (profit > 0 && inputValue > profit) {
      const profitInBath = profit * (partnerShare / 100) * rate;

      // คำนวณ principal ที่เหลือหลังจากหัก profit
      const principalInBath = (inputValue - profit) * rate;
  
      // คำนวณผลรวมทั้งหมด
      const totalInBath = profitInBath + principalInBath;
  
      // Update state
      setValue(inputValue);
      setGotValue(totalInBath.toFixed(2));
    } else if (profit > 0) {
      const totalPartnerShare = parseFloat((inputValue * (partnerShare / 100)) * rate)
      setValue(inputValue);
      setGotValue(totalPartnerShare.toFixed(2))
    } else {
      const totalInUSD = parseFloat(inputValue) * rate;
      
      // Ensure the value is positive
      const positiveValue = Math.abs(inputValue);
    
      // Update the state with the values
      setValue(inputValue);
      setGotValue(totalInUSD.toFixed(2)); // Display with 2 decimal points
    }

    // Convert Baht to USD
    };

    // wallet part

    // get Wallet

    const [account, setAccount] = useState('')
    const [accountName, setAccountName] = useState('')
    const [bankName, setBankName] = useState('')
    const [wallet, setWallet] = useState('')
    const [freeze, setFreeze] = useState('')
    const [profit, setProfit] = useState('')
    const [principal, setPrincipal] = useState('')
    const [loading, setLoading]  = useState(false)
    // console.log(gotValue)

    useEffect(() => {
      const fetchData = async () => {
        const res = await axios.get(`${backend}/api/user-wallet`, {
          withCredentials: true
        })
        console.log(res)
        const data = res.data[0]
        setAccount(data.UBW_account)
        setAccountName(data.UBW_bank_account_name)
        setBankName(data.UBW_bank_name)
        setWallet(data.wallet_main_wallet)
        setFreeze(data.wallet_freeze)
        setProfit(data.wallet_profit)
        setPrincipal(data.wallet_principal)
      }
      fetchData()
    }, [])

    // send withdraw request

    const handleSubmit = async (e) => {
      e.preventDefault()

      if (!account || !accountName || !bankName || !wallet) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "ข้อมูลไม่ครบถ้วนกรุณาเพิ่มข้อมูลหน้าแก้ไขข้อมูล",
        });
        return
      } 

      if (!value) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "โปรดกรอกจำนวนเงินการถอน",
        });
        return
      }

      if (value > wallet) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: "ยอดเงินคงเหลือไม่เพียงพอ",
        });
        return
      }

      if (value > profit) {
        Swal.fire({
          title: "included principal ?",
          text: `your profit is ${profit} and principal is ${wallet - profit}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Withdraw it!"
        }).then(async (result) => {
          if (result.isConfirmed) {
  
            try {
              const res = await axios.post(`${backend}/api/user-wallet/withdraw-request`, {
                amount: value,
                userHave: gotValue,
                includedPrincipal: 1
              }, {withCredentials: true})
              Swal.fire({
                title: "Request Success!",
                text: res.data,
                icon: "success",
                timer: 1500
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);      
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Oops",
                text: error.response.data,
              });
            }
  
          }
        });
        return
      }

      try {
        Swal.fire({
          title: "Withdraw only Profit",
          text: "Your will withdraw only profit ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, withdraw it!"
        }).then(async (result) => {
  
          if (result.isConfirmed) {
  
            try {
              const res = await axios.post(`${backend}/api/user-wallet/withdraw-request`, {
                amount: value,
                userHave: gotValue,
                includedPrincipal: 0
              }, {withCredentials: true})
    
              Swal.fire({
                title: "Success!",
                text: res.data,
                icon: "success",
                timer: 1500
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500)
              setLoading(false)
            } catch (error) {
              Swal.fire({
                icon: "error",
                title: "Oops",
                text: error.response.data,
              });
              setLoading(false)
            }
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops",
          text: error.response.data,
        });
        setLoading(false)
      }
      setLoading(false)
    }

    // query transactios

    const [transactions, setTransactions] = useState()

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${backend}/api/user-wallet/get-transactions`, {
            withCredentials: true
          })
          console.log("transactions is", res.data)
          setTransactions(res.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
    }, [])

  return (
    <div className='bank-deposit'>
      {loading ? <div style={{position: "absolute", zIndex: 1000, transform: "translate(0%, -10%)"}}><IsLoading /></div> : null}
      <div className="bank-deposit-container">

          <div className="bank-top">

            <div className="left">
              <div className="left-header"> ช่องทางการรับเงิน </div>
              <div className="img">
                <img src={`/assets/bank/${bankName}.jpg`} alt="" />
              </div>
              <div className="bank">
                <p>ธนาคาร:</p>
                <p className="bold"> {bankName} </p>
              </div>
              <div className="bank-number">
              <p>เลขบัญชี:</p>
              <p className="bold">{account}</p>
              </div>
              <div className="bank-receiver">
              <p>ชื่อบัญชี:</p>
              <p className="bold">{accountName}</p>
              </div>
              <div className="bank-receiver">
              <p>แช่แข็ง:</p>
              <p className="bold"> {freeze} USDT </p>
              </div>
              <div className="bank-receiver">
              <p>กำไร:</p>
              <p className="bold"> {profit} USDT </p>
              </div>
              <div className="bank-receiver">
              <p>ยอดเงินที่ถอนได้:</p>
              <p className="bold"> {wallet} USDT </p>
              </div>
            </div>

            <div className="right">
              <div className="right-header">
                <div>โปรดเลือกจำนวนการถอน</div>
                <button className='slip-btn' onClick={handleSubmit}> ถอนเงิน </button>
              </div>

              {/* <label htmlFor="files">
              <img src="assets/Remove-111.png" alt="" />
              </label>
              <input type="file" id='files' name='files' style={{display: "none"}}/> */}

              <div className="your-transfered">
                <div className="transfer-amount">
                  <p>จำนวนเงิน:</p>
                  <input type="number" min="0" value={value} className='withdraw'
                  onInput={handleInput}/>
                  <div className='usdt' style={{height: "20px"}}>USDT</div>
                </div>
                <div className="transfer-total">
                  <p className='you-will-got'>คุณจะได้:</p>
                  <input type="number" disabled value={gotValue}/>
                  <p className='usdt' style={{height: "20px"}}>บาท</p>
                </div>
              </div>

              <div className="warning">
              คำแนะนำ: <br />
              กรุณาเช็คให้แน่ใจว่าข้อมูลบัญชีธนาคารที่คุณกรอกถูกต้อง หากคุณกรอกหมายเลขบัญชีผิดหรือลืมใส่ข้อมูลที่สำคัญ เช่น ชื่อบัญชีที่ตรงกัน ธนาคารจะไม่รับผิดชอบความเสียหายที่เกิดขึ้น เพื่อความปลอดภัยของเงินทุนของคุณ กรุณาตรวจสอบรายละเอียดการโอนเงินอย่างละเอียดก่อนยืนยันการทำรายการ โดยการโอนเงินจะใช้เวลาประมาณ 1 วันทำการ เวลาสำหรับการตรวจสอบรายการโอนคือ 22:00-24:00 น. (UTC+8) ของทุกวัน
              </div>
            </div>

            </div>


          <div className="deposit-details">
          <div className="details-header">
            <div className="left"> {t("deposit-history")} </div>
            <div className="right">
              <input type="checkbox" />
              {t("only-the-current")}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th> ธนาคาร </th>
                <th>{t("coin-amount")}</th>
                <th>{t("coin-time")}</th>
                <th>จำนวนที่ได้ </th>
                <th>{t("trans-id")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>
            <tbody>

              {transactions && transactions.map((trans, index) => (
              <tr key={index}>
                <td className="coin">เงินบาท</td>
                <td> {trans.AT_amount} USDT </td>
                <td> {new Date(trans.AT_date_time).toLocaleString()} </td>
                <td>{trans.AT_user_get} บาท</td>
                <td>{trans.AT_transactions_hash}</td>
                <td className={trans.AT_status === "pending" ? "table-status-yellow" : trans.AT_status === "success" ? "table-status-green" : "table-status-red"}> {trans.AT_status} </td>
              </tr>
              ))}

              {/* <tr>
              <td className="coin">เงินบาท</td>
              
              <td> 1,428 USDT </td>
                <td>11/07/2024 14:41:26</td>
                <td>50,000 บาท</td>
                <td>0xa39aa522ff8851223ffskppka21mz...</td>
                <td className="table-status-green">เสร็จสิ้น</td>
              </tr>

              <tr>
                <td className="coin">เงินบาท</td>
                <td> 1,428 USDT </td>
                <td>11/07/2024 14:41:26</td>
                <td>50,000 บาท</td>
                <td>zcvk123cv22ff8851223ffskppka538a...</td>
                <td className="table-status-yellow">กำลังดำเนินการ</td>
              </tr>

              <tr>
                <td className="coin">เงินบาท</td>
                <td> 1,428 USDT </td>
                <td>11/07/2024 14:41:26</td>
                <td>50,000 บาท</td>
                <td>bbdaa522ff8851223ffskppka538a...</td>
                <td className="table-status-red">ไม่สำเร็จ <a href=""> เนื่องจาก </a> </td>
              </tr> */}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default BankWithdraw
