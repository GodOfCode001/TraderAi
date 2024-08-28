import React from "react";
import { useTranslation } from "react-i18next";
import "./deposit.css";

const Deposit = () => {
  const { t } = useTranslation();
  return (
    <div className="deposit">
      <div className="deposit-container">
        <div className="deposit-info">
          <div className="balance">
            <div className="balance-header">
              <div className="left"> <div className="img">
                <img src="assets/coin/usdt.png" alt="" /></div> USDT</div>
              <div className="right"> {t("teach")} &gt; </div>
            </div>

            <div className="balance-minimum">
              <div className="left"> {t("minimum")} </div>
              <div className="right">1 USDT</div>
            </div>

            <div className="balance-now">
              <div className="left">{t("balance")}</div>
              <div className="right">0.02 USDT</div>
            </div>

            <div className="balance-freeze">
              <div className="left">{t("freeze")}</div>
              <div className="right">0 USDT</div>
            </div>

            <div className="contract-address">
              <div className="left">{t("address")}</div>
              <div className="right"> TR7N****jLj6t </div>
            </div>

            <div className="total-balance">
              <div className="left">{t("total")}</div>
              <div className="right">0.02 USDT </div>
            </div>

            <div className="chain">
              <button>BEP20</button>
            </div>
          </div>

          <div className="deposit-address-details">
            <div className="details-header">
            {t("address-name")}: BTC Binance Smart Chain (BEP20)
            </div>
            <div className="details-all">
              <div className="address-information">
                <p>TUZue4mxojMNgr2s1oZ61SaY2o8YizDV97</p>
                <button className="copy"> {t("copy")} </button>
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
              <tr>
                <td className="coin"><div className="img">
                <img src="assets/coin/usdt.png" alt="" /></div> USDT</td>
                <td>1.562136</td>
                <td>11/07/2024 14:41:26</td>
                <td>0x82e59aff995f689b0c79b0c...</td>
                <td>0xa39aa522ff8851223ffskppka21mz...</td>
                <td className="table-status-green">เสร็จสิ้น</td>
              </tr>
              <tr>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
