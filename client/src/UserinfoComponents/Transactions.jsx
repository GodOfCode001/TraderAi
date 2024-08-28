import React from 'react'
import './transactions.css'
import { useTranslation } from "react-i18next";

const Transactions = () => {

    const { t } = useTranslation();
  return (
    <div className='transaction'>
        <div className="transaction-container">

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
                <th> ประเภท </th>
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
                <td>23ffskppka21mz...</td>
                <td className="table-status-green">เสร็จสิ้น</td>
              </tr>
              <tr>
                <td className="coin">เงินบาท</td>
                <td> 1,428 USDT </td>
                <td>11/07/2024 14:41:26</td>
                <td>50,000 บาท</td>
                <td>23ffskppka538a...</td>
                <td className="table-status-yellow">กำลังดำเนินการ</td>
              </tr>
              <tr>
                <td className="coin">เงินบาท</td>
                <td> 1,428 USDT </td>
                <td>11/07/2024 14:41:26</td>
                <td>50,000 บาท</td>
                <td>ffskppka538a...</td>
                <td className="table-status-red">ไม่สำเร็จ <a href=""> เนื่องจาก </a> </td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
    </div>
  )
}

export default Transactions
