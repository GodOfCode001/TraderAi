import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import './bankDeposit.css'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Link, useNavigate }  from 'react-router-dom'
import IsLoading from '../components/IsLoading'

const BankDeposit = () => {
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  const [gotValue, setGotValue] = useState(0);
  // console.log(gotValue)
  const [topupAmount, setTopupAmount] = useState()
  const [files, SetFiles] = useState(null)
  const { backend,forceLogout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  // submit topup request

  const handleSendFile = async () => {
    const formData = new FormData()
    formData.append('slip', files)
    formData.append('amount', value)
    formData.append('receiver', bank.bank_account_name)
    formData.append('account', bank.bank_account)
    formData.append('bank_name', bank.bank_name)
    formData.append('user_get', gotValue)

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
        setLoading(true)
        if (!formData.amount && !files) {
          Swal.fire({
            title: "กรอกข้อมูลไม่ครบถ้วน",
            text: "โปรดกรอกจำนวนเงิน และ แนบสลิป",
            icon: "question"
          });
          setLoading(false)
          return
        }

        try {
          const res = await axios.post(`${backend}/api/upload-slip`, formData, {
            withCredentials: true
          })
          // console.log(res)
          if (res.status === 200) {
            
          }
        } catch (error) {
          console.log(error)
        }
        setLoading(false)
        Swal.fire({
          title: "Success",
          text: "Your request was successfully",
          icon: "success",
          timer: 1500
        });
        setTimeout(() => {
          window.location.reload()
        }, 1500);
      }
    });
  }
  
  const handleInput = (e) => {
  const usd = 33; // Exchange rate (1 USD = 33 Baht)
  
  // Get the user's input value (Baht amount)
  const inputValue = e.target.value.replace(/^0+/, '') || '0';
  
  // Convert Baht to USD
  const totalInUSD = parseFloat(inputValue) / usd;
  
  // Ensure the value is positive
  const positiveValue = Math.abs(inputValue);

  // Update the state with the values
  setValue(positiveValue);
  setGotValue(totalInUSD.toFixed(2)); // Display with 2 decimal points
  };

  const handleSubmit = (e) => {
    e.preventDefault()
  }

const [bank, setBank] = useState(null)
const [transactions, setTransactions] = useState(null)
const navigate = useNavigate()

// query website bank

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${backend}/api/deposit-bank`, {
        withCredentials: true
      })
      console.log(res.data[0])
      setBank(res.data[0])      
    } catch (error) {
      if (error.response.status === 403 && error.response.status === 401) {
        forceLogout()
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Token expired, please login",
          timer: 2000
        });
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }
    }
  }
  fetchData()
}, [])

// query transactions

useEffect(() => {
  const fetchData = async () => {
    const res = await axios.get(`${backend}/api/deposit-bank/transactions`, {
      withCredentials: true
    })
    console.log(res)
    if (res.status === 404) {
      setTransactions(null)
    }
    setTransactions(res.data)
  }
  fetchData()
}, [])


  return (
    <div className="bank-deposit">
      <div className="bank-deposit-container">
        {loading && (
          <div
            style={{
              display: loading ? "block" : "none",
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "1000",
            }}
          >
            <IsLoading />
          </div>
        )}

        <div className="bank-top">
          <div className="left">
            <div className="left-header"> ช่องทางการชำระเงิน </div>
            <div className="img">
              <img src={`assets/${bank?.bank_img}`} alt="" />
            </div>
            <div className="bank">
              <p>ธนาคาร:</p>
              <p className="bold"> {bank?.bank_name} </p>
            </div>
            <div className="bank-number">
              <p>เลขบัญชี:</p>
              <p className="bold"> {bank?.bank_account} </p>
            </div>
            <div className="bank-receiver">
              <p>ชื่อบัญชี:</p>
              <p className="bold"> {bank?.bank_account_name} </p>
            </div>
          </div>

          <div className="right">
            <div className="right-header">
              <div>โปรดแนบหลักฐานการโอน</div>
              <button className="slip-btn" onClick={handleSendFile}>
                {" "}
                ส่งหลักฐาน{" "}
              </button>
            </div>

            <label htmlFor="files">
              <img
                src={
                  files ? URL.createObjectURL(files) : "assets/Remove-111.png"
                }
                alt=""
                id={files ? "with-img" : "no-img"}
              />
            </label>
            <input
              type="file"
              id="files"
              name="files"
              onChange={(e) => SetFiles(e.target.files[0])}
              style={{ display: "none" }}
            />

            <div className="your-transfered">
              <div className="transfer-amount">
                <p>จำนวนเงิน:</p>
                <input
                  type="number"
                  min="0"
                  value={value}
                  onInput={handleInput}
                />
              </div>
              <div className="transfer-total">
                <p className="you-will-got">คุณจะได้</p>
                <input type="number" disabled value={gotValue} />
                <p className="usdt">USDT</p>
              </div>
            </div>

            <div className="warning">
              คำแนะนำ: <br />
              กรุณาเช็คให้แน่ใจว่าข้อมูลบัญชีธนาคารที่คุณกรอกถูกต้อง
              หากคุณกรอกหมายเลขบัญชีผิดหรือลืมใส่ข้อมูลที่สำคัญ เช่น
              ชื่อบัญชีที่ตรงกัน ธนาคารจะไม่รับผิดชอบความเสียหายที่เกิดขึ้น
              เพื่อความปลอดภัยของเงินทุนของคุณ
              กรุณาตรวจสอบรายละเอียดการโอนเงินอย่างละเอียดก่อนยืนยันการทำรายการ
              โดยการโอนเงินจะใช้เวลาประมาณ 1 วันทำการ
              เวลาสำหรับการตรวจสอบรายการโอนคือ 22:00-24:00 น. (UTC+8) ของทุกวัน
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

              {transactions &&
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="coin">เงินบาท</td>

                    <td> {transaction.AT_amount.toLocaleString()} </td>
                    <td> {new Date(transaction.AT_date_time).toLocaleString()} </td>
                    <td>{transaction.AT_user_get.toLocaleString()} USDT</td>
                    <td> {transaction.AT_transactions_hash} </td>
                    <td className={transaction.AT_status === 'pending' ? 'table-status-yellow' : transaction.AT_status === 'success' ? "table-status-green" : "table-status-red"}> {transaction.AT_status} {transaction.AT_status === 'denied' ? <Link> เนื่องจาก </Link> : null}</td>
                  </tr>
                ))}

              {/* {/* <tr>
                <td className="coin">เงินบาท</td>

                <td> 50,000 </td>
                <td>11/07/2024 14:41:26</td>
                <td>1,428 USDT</td>
                <td>0xa39aa522ff8851223ffskppka21mz...</td>
                <td className="table-status-green">เสร็จสิ้น</td>
              </tr> */}
              
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BankDeposit
