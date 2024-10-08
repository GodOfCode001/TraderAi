import React from "react";
import './userMain.css'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const UserMain = ({ isOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const selection = () => {
    navigate('/topup')
  }
  const withdraw = () => {
    navigate('/withdraw')
  }

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
            <div className="balance-info">2.2 usdt</div>
            <div className="thb">62.8 {t("thb")} </div>
          </div>

          <div className="right">
            <button className="deposit-btn" onClick={selection}>{t("deposit")}</button>
            <button className="deposit-btn" onClick={withdraw}>{t("withdraw")}</button>
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
