import React from 'react'
import './topupSelect.css'
import { useTranslation} from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const TopupSelect = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const cryptoDeposit = () => {
        navigate('/crypto-deposit');
    }

    const bankDeposit = () => {
        navigate('/bank-deposit');
    }
  return (
    <div className='topup-select'>
      <div className="topup-select-container">

        <div className="topup-choose">
            <div className="topup-header">
                <div className="topup-eng"> Topup Selection </div>
                <div className="topup-th"> เลือกช่องทางการเติมเงิน </div>
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
                    
                    <button className='topup-red-btn' onClick={cryptoDeposit}>  {t("deposit")} </button>
                </div>

                <div className="card">
                    <div className="top">

                    <div className="img slip">
                        <img src="assets/topup/slipscanpay.png" alt="" />
                    </div>
                    <div className="selecter-text">
                        <div className="select-name"> โอนเงินผ่านธนาคาร </div>
                        <div className="select-status"><div className='green'></div> Available </div>
                    </div>

                    </div>
                    
                    <button className='topup-green-btn' onClick={bankDeposit}> {t("deposit")} </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}

export default TopupSelect
