import React from 'react'
import "./topupSelect.css"
import { useTranslation} from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'

const WithdrawSelect = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const cryptoWithdraw = () => {
        navigate('/crypto-withdraw');
    }

    const bankWithdraw = () => {
        navigate('/bank-withdraw');
    }
  return (
    <div className='topup-select'>
      <div className="topup-select-container">

        <div className="topup-choose">
            <div className="topup-header">
                <div className="topup-eng"> Withdraw Selection </div>
                <div className="topup-th"> เลือกช่องทางการถอนเงิน </div>
            </div>

            <div className="topup-card">
                <div className="card">
                    <div className="top">

                    <div className="img">
                        <img src="assets/topup/crypto.jpg" alt="" />
                    </div>
                    <div className="selecter-text">
                        <div className="select-name"> Crypto Currencies (USDT) </div>
                        <div className="select-status"> <div className='green'></div> Available </div>
                    </div>

                    </div>
                    
                    <Link className='topup-red-btn link' to="/crypto-withdraw">  {t("withdraw")} </Link>
                </div>

                <div className="card">
                    <div className="top">

                    <div className="img slip">
                        <img src="assets/topup/slipscanpay.png" alt="" />
                    </div>
                    <div className="selecter-text">
                        <div className="select-name"> ถอนเงินผ่านธนาคาร </div>
                        <div className="select-status"><div className='green'></div> Available </div>
                    </div>

                    </div>
                    
                    <Link className='topup-green-btn link' to="/bank-withdraw/?cat=B2D"> {t("withdraw")} </Link>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}

export default WithdrawSelect
