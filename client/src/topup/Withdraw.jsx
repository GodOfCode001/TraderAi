import React, { useContext, useEffect, useState } from "react";
import "./deposit.css";
import { useTranslation } from "react-i18next";
import axios from 'axios'
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import IsLoading from "../components/IsLoading";

const Withdraw = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [gotValue, setGotValue] = useState(0);
  const [loading, setLoading] = useState(false)
  const [includedPrincipal, setIncludedPrincipal] = useState(0)
  
  const { backend } = useContext(AuthContext)
  const [wallet, setWallet] = useState()
  const totalWallet = wallet?.wallet_main_wallet
  const totalProfit = wallet?.wallet_profit

  const handleInput = (e) => {
    // Remove leading zeros and ensure the value is positive
    const inputValue = e.target.value.replace(/^0+/, "") || "0";
    const positiveValue = Math.abs(inputValue);

    setValue(inputValue);
    setGotValue(inputValue);
  };

  // fetch user wallet

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user-wallet/crypto-wallet`, {withCredentials: true})
        setWallet(res.data[0])
        console.log(res.data[0])
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  // fetch transactions

  const [transactions, setTransactions] = useState()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${backend}/api/user-wallet/get-withdraw-transactions`, {
          withCredentials: true
        })
        setTransactions(res.data)
        console.log(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  // handle submit

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)


    if (!value || !gotValue) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter amount of withdraw",
      });
      setLoading(false)
      return
    }

    if (value > totalWallet) {
      Swal.fire({
        icon: "error",
        title: "Oops",
        text: "Your remaining balance not enough",
      });
      setLoading(false)
      return
    }

    if (value > totalProfit) {
      Swal.fire({
        title: "included principal ?",
        text: `your profit is ${totalProfit} and principal is ${totalWallet - totalProfit}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, included it!"
      }).then( async (result) => {
        if (result.isConfirmed) {

          try {
            const res = await axios.post(`${backend}/api/user-wallet/crypto-withdraw-request`, {
              amount: value,
              userHave: gotValue,
              includedPrincipal: 1
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
      setLoading(false)
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
            const res = await axios.post(`${backend}/api/user-wallet/crypto-withdraw-request`, {
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

  return (
    <div className="deposit">
      {loading ? <div style={{position: "absolute"}}><IsLoading /></div> : null}
      <div className="deposit-container">
        <div className="deposit-info">
          <div className="deposit-address-details">

            <div className="crypto-withdraw">
            <div>โปรดตรวจสอบทุกอย่างให้ทุกต้อง</div>
            <button className="withdraw-btn" onClick={handleSubmit}> ถอนเงิน </button>
            </div>
            <div className="address-header">
              <p className="address-name"> {t("wallet-address")} : </p>
              <input type="text" value={wallet ? wallet.UCW_address : ""} disabled/>
            </div>
            <div className="details-all">
              <div className="address-information">
                <div className="amount-input">
                  <p className="count"> {t("coin-amount")} </p>
                  <input
                    type="number"
                    min="0"
                    max={wallet ? wallet.wallet_main_wallet : 0}
                    value={value}
                    onChange={handleInput}
                  />
                  <p className="all">{t("all")}</p>
                </div>

                <div className="amount-willgot">
                  <p className="name"> {t("you-will-got")} </p>
                  <input type="number" value={gotValue} disabled />
                  <p className="amount-name">USDT</p>
                </div>
              </div>


              <div className="warning">
                {t("warning-header")}: <br />
                {t("withdraw-warning-body")}
              </div>
            </div>
          </div>

          <div className="balance">
            <div className="balance-header">
              <div className="left">
                {" "}
                <div className="img">
                  <img src="assets/coin/usdt.png" alt="" />
                </div>{" "}
                USDT
              </div>
              <div className="right">{t("withdraw-teach")} &gt; </div>
            </div>

            <div className="balance-minimum">
              <div className="left">{t("withdraw-minimum")}</div>
              <div className="right">1 USDT</div>
            </div>

            <div className="balance-now">
              <div className="left">{t("balance")}</div>
              <div className="right">{wallet ? wallet.wallet_main_wallet : 0.00} USDT</div>
            </div>

            <div className="balance-freeze">
              <div className="left">{t("freeze")}</div>
              <div className="right">{wallet ? wallet.wallet_freeze : 0} USDT</div>
            </div>

            <div className="contract-address">
              <div className="left">{t("quota")}</div>
              <div className="right">{wallet ? wallet.wallet_remaining : 0} ครั้ง </div>
            </div>

            <div className="total-balance">
              <div className="left">กำไร</div>
              <div className="right">{wallet ? wallet.wallet_profit : 0} USDT </div>
            </div>

            <div className="total-balance">
              <div className="left">{t("total")}</div>
              <div className="right">{wallet ? wallet.wallet_main_wallet + wallet.wallet_freeze : 0} USDT </div>
            </div>

            <div className="chain">
              <button>{wallet ? wallet.UCW_chain : ""}</button>
            </div>
          </div>
        </div>

        <div className="deposit-details">
          <div className="details-header">
            <div className="left">{t("withdraw-history")}</div>
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

            {transactions && transactions.map((trans, index) => (
              <tr key={index}>
              <td className="coin">
                <div className="img">
                  <img src={`assets/coin/${trans.AT_crypto_symbol.toLowerCase()}.png`} alt="crypto symbol" />
                </div>
                {trans.AT_crypto_symbol}
              </td>
              <td> {trans.AT_amount} </td>
              <td> {new Date(trans.AT_date_time).toLocaleString()} </td>
              <td> {trans.AT_user_address} </td>
              <td> {trans.AT_transactions_hash} </td>
              <td className={trans.AT_status === "pending" ? "table-status-yellow" : trans.AT_status === "success" ? "table-status-green" : "table-status-red"}> {trans.AT_status}  {trans.AT_status === "denied" ? <a href="">เนื่องจาก</a> : null } </td>
            </tr>
            ))}

              {/* <tr>
                <td className="coin">
                  <div className="img">
                    <img src="assets/coin/usdt.png" alt="" />
                  </div>{" "}
                  USDT
                </td>
                <td>1.562136</td>
                <td>11/07/2024 14:41:26</td>
                <td>0x82e59aff995f689b0c79b0c...</td>
                <td>0xa39aa522ff8851223ffskppka21mz...</td>
                <td className="table-status-green">เสร็จสิ้น</td>
              </tr>

              <tr>
                <td className="coin">
                  <div className="img">
                    <img src="assets/coin/usdt.png" alt="" />
                  </div>{" "}
                  USDT
                </td>
                <td>0.83562</td>
                <td>11/07/2024 13:50:10</td>
                <td>0x82e59aff995f689b0c79b0c...</td>
                <td>zcvk123cv22ff8851223ffskppka538a...</td>
                <td className="table-status-yellow">กำลังดำเนินการ</td>
              </tr>

              <tr>
                <td className="coin">
                  <div className="img">
                    <img src="assets/coin/usdt.png" alt="" />
                  </div>{" "}
                  USDT
                </td>
                <td>0.51125</td>
                <td>11/07/2024 12:21:10</td>
                <td>0x82e59aff995f689b0c79b0c...</td>
                <td>bbdaa522ff8851223ffskppka538a...</td>
                <td className="table-status-red">
                  ไม่สำเร็จ <a href=""> เนื่องจาก </a>{" "}
                </td>
              </tr> */}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
