import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import './bankDeposit.css'

const BankWithdraw = () => {

    const { t } = useTranslation();

    const [value, setValue] = useState(0);
    const [gotValue, setGotValue] = useState(0);
    
    const handleInput = (e) => {
    // Remove leading zeros and ensure the value is positive
    const usd = 33; // Exchange rate (1 USD = 33 Baht)
    
    // Get the user's input value (Baht amount)
    const inputValue = e.target.value.replace(/^0+/, '') || '0';
    
    // Convert Baht to USD
    const totalInUSD = parseFloat(inputValue) * usd;
    
    // Ensure the value is positive
    const positiveValue = Math.abs(inputValue);
  
    // Update the state with the values
    setValue(positiveValue);
    setGotValue(totalInUSD.toFixed(2)); // Display with 2 decimal points
    };
  return (
    <div className='bank-deposit'>
      <div className="bank-deposit-container">

          <div className="bank-top">

            <div className="left">
              <div className="left-header"> ช่องทางการรับเงิน </div>
              <div className="img">
                <img src="assets/kasikorn.jpg" alt="" />
              </div>
              <div className="bank">
                <p>ธนาคาร:</p>
                <p className="bold">กสิกรไทย</p>
              </div>
              <div className="bank-number">
              <p>เลขบัญชี:</p>
              <p className="bold">0231235498</p>
              </div>
              <div className="bank-receiver">
              <p>ชื่อบัญชี:</p>
              <p className="bold">user1234567</p>
              </div>
              <div className="bank-receiver">
              <p>มีเงินทั้งหมด:</p>
              <p className="bold"> 1,500 USDT </p>
              </div>
            </div>

            <div className="right">
              <div className="right-header">
                <div>โปรดเลือกจำนวนการถอน</div>
                <button className='slip-btn'> ถอนเงิน </button>
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
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

export default BankWithdraw
