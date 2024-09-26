import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./deposit.css";
import { AuthContext } from '../context/AuthContext'
import IsLoading from '../components/IsLoading'
import axios from "axios";
import { Navigate, useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";

const Deposit = ({ data }) => {
  const { t } = useTranslation();
  const { backend,currentUser,forceLogout, setCurrentUser } = useContext(AuthContext)
  const [loading, SetLoading] = useState(true)
  const [transactions, SetTransaction] = useState(null)
  const navigate = useNavigate()

   useEffect(() => {
    SetLoading(true)
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/query-crypto-transactions`, {
          withCredentials: true
        })

        if (res.data === "NOTOK") {
          setCurrentUser(null)
          localStorage.clear()
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Token expired, Pleases login again",
            timer: 2000
          });
          setTimeout(() => {
            navigate('/login')
          }, 2000);
        }
        // console.log(res.data)
        SetTransaction(res.data)
        SetLoading(false)

      } catch (error) {
        if (error.response.status === 403) {
          await forceLogout()
          SetLoading(false)
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Token expired, Pleases login again",
            timer: 3000
          });
          setTimeout(() => {
            navigate('/login')
          }, 3000);
          SetLoading(false)
        }
      }
    }
    fetchData()
    SetLoading(false)
   }, [currentUser])

  if (loading && !transactions) {
    return <IsLoading />
  }

  const handleCopy = () => {
    const copyText = document.getElementById("sub-address").innerText;
    console.log(copyText);
  
    // สร้าง textarea ชั่วคราวเพื่อคัดลอกข้อความ
    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = copyText;
    document.body.appendChild(tempTextarea);
    
    tempTextarea.select();
    document.execCommand("copy");
    
    document.body.removeChild(tempTextarea); // ลบ textarea หลังคัดลอก
  
    const popup = document.getElementById("popup-notification");
    popup.style.display = 'block';  // แสดง popup
    popup.style.opacity = '1';      // เริ่มต้นด้วย opacity เต็ม
  
    // ซ่อน popup หลังจาก delay สั้น ๆ
    setTimeout(() => {
      popup.style.opacity = '0'; // เริ่มลด opacity
      setTimeout(() => {
        popup.style.display = 'none';  // ซ่อน display หลังจาก transition จบ
      }, 300); // ตรงกับ delay ของ transition (300ms)
    }, 500); // แสดง popup 0.5 วินาทีก่อน fading out
  }

  // console.log(transaction)

  return (
    <div className="deposit">
      <div className="deposit-container">
        <div className="deposit-info">

          <div className="balance">
            <div className="balance-header">
              <div className="left"> <div className="img">
                <img src="assets/coin/usdt.png" alt="" /></div> USDT </div>
              <div className="right"> {t("teach")} &gt; </div>
            </div>

            <div className="balance-minimum">
              <div className="left"> {t("minimum")} </div>
              <div className="right">1 USDT</div>
            </div>

            <div className="balance-now">
              <div className="left">{t("balance")}</div>
              <div className="right">{data ? data.wallet_main_wallet : 0} USDT</div>
            </div>

            <div className="balance-freeze">
              <div className="left">{t("freeze")}</div>
              <div className="right">{data ? data.wallet_freeze : 0} USDT</div>
            </div>

            <div className="contract-address">
              <div className="left">{t("address")}</div>
              <div className="right"> TR7N****jLj6t </div>
            </div>

            <div className="total-balance">
              <div className="left">{t("total")}</div>
              <div className="right">{data ? data.wallet_main_wallet: 0} USDT </div>
            </div>

            <div className="chain">
              <button>BEP20</button>
            </div>
          </div>

          <div className="deposit-address-details">
            <div className="details-header">
            {t("address-name")}: BTC Binance Smart Chain (BEP20)
            </div>
          <div id="popup-notification">Copied!</div>
            <div className="details-all">
              <div className="address-information" >
                <p id="sub-address"> {data ? data.sub_address : null} </p>
                <button className="copy" onClick={handleCopy}> {t("copy")} </button>
                
              </div>

              <div className="warning">
              {t("warning-header")}: <br />
              {t("warning-body")}
              </div>
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
                <th> {t("coin-type")} </th>
                <th>{t("coin-amount")}</th>
                <th>{t("coin-time")}</th>
                <th>{t("address-crypto")}</th>
                <th>{t("trans-id")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="coin"><div className="img">
                <img src="assets/coin/usdt.png" alt="" /></div> <p style={{textTransform: "uppercase"}}>{transaction.topup_symbol}</p> </td>
                <td> {transaction.topup_value / Math.pow(10, transaction.topup_token_decimal)} </td>
                <td className="specifi"> {new Date(transaction.topup_time_stamp * 1000).toLocaleString()} </td>
                <td> {transaction?.topup_from} </td>
                <td> {transaction?.topup_block_hash} </td>
                <td className={transaction.topup_status === "pending" ? "table-status-yellow" : transaction.topup_status === "success" ? "table-status-green" : "table-status-red"}> {transaction.topup_status} </td>
              </tr>
              ))}
              {/* <tr>
                <td className="coin"><div className="img">
                <img src="assets/coin/usdt.png" alt="" /></div> USDT</td>
                <td>0.83562</td>
                <td>11/07/2024 13:50:10</td>
                <td>0x82e59aff995f689b0c79b0c...</td>
                <td>zcvk123cv22ff8851223ffskppka538a...</td>
                <td className="table-status-yellow">กำลังดำเนินการ</td>
              </tr>
              <tr>
                <td className="coin"><div className="img">
                <img src="assets/coin/usdt.png" alt="" /></div> USDT</td>
                <td>0.51125</td>
                <td>11/07/2024 12:21:10</td>
                <td>0x82e59aff995f689b0c79b0c...</td>
                <td>bbdaa522ff8851223ffskppka538a...</td>
                <td className="table-status-red">ไม่สำเร็จ <a href=""> เนื่องจาก </a> </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
