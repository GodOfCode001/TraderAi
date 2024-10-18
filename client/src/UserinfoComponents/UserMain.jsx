import React, { useContext, useEffect, useState } from "react";
import './userMain.css'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UserMain = ({ isOpen }) => {
  const { t } = useTranslation();
  const { backend } = useContext(AuthContext)
  const [wallet, setWallet] = useState()
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    setIsLoad(true)
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user-wallet/get-main-wallet`, {
          withCredentials: true
        })
        setWallet(res.data[0])
      } catch (error) {
        console.error(error)
      }
    }
    setIsLoad(false)
    fetchData()
  }, [])

  return (
    <div className={`usermain ${isOpen ? '' : 'open'}`}>
      <div className="usermain-container">
        <div className="profit-loss">
          <div className="top">
            <div className="title"> {t("profit-loss")} </div>
            <div className="profit-percentage"> +200% </div>
          </div>

          <div className="bottom">
            <div className="title">{t("what-ever")}</div>
            <div className="body-profit-percentage">
              <p className="profit">+200%</p>
              <p className="cutloss">-20%</p>
            </div>
          </div>
        </div>

        <div className="balance">
          <div className="left">
            <div className="balance-name">{t("balance-name")}</div>
            <div className="balance-info"> {isLoad ? <div className="loader"></div> : <p> {wallet?.wallet_main_wallet} USDT </p> } </div>
            <div className="thb"> {isLoad ? <div className="loader"></div> : <p> {(wallet?.wallet_main_wallet / wallet?.currency_rate).toFixed(2)} {t("thb")} </p> }  </div>
          </div>

          <div className="right">
            <Link className="deposit-btn link" to="/topup"> {t("deposit")}  </Link>
            <Link className="deposit-btn link" to="/withdraw"> {t("withdraw")} </Link>
          </div>
        </div>

        <div className="usermain-blog">
          <div className="card">
            <div className="card-header">how to Gain more lose less ? how to Gain more lose less ? how to Gain more lose less ? how to Gain more lose less ?</div>
            <div className="card-img">
              <img src="/assets/trade.png" alt="" />
            </div>
            <p className="card-details">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
              vel consectetur necessitatibus labore ipsum, culpa aliquid adipisicing elit. Natus
              vel amet consectetur
            </p>
            <div className="read-more">Read more...</div>
          </div>

          <div className="card">
            <div className="card-header">how to Gain more lose less ?</div>
            <div className="card-img">
              <img src="/assets/trade.png" alt="" />
            </div>
            <p className="card-details">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
              vel consectetur necessitatibus labore ipsum, culpa aliquid adipisicing elit. Natus
              vel amet consectetur
            </p>
            <div className="read-more">Read more...</div>
          </div>

          <div className="card">
            <div className="card-header">how to Gain more lose less ?</div>
            <div className="card-img">
              <img src="/assets/trade.png" alt="" />
            </div>
            <p className="card-details">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
              vel consectetur necessitatibus labore ipsum, culpa aliquid adipisicing elit. Natus
              vel amet consectetur
            </p>
            <div className="read-more">Read more...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
