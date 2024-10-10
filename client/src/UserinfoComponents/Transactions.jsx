import React, { useContext, useEffect, useState } from 'react'
import './transactions.css'
import { useTranslation } from "react-i18next";
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { Link } from 'react-router-dom';

const Transactions = () => {

    const { t } = useTranslation();

    const [transaction, setTransaction] = useState([])
    const { backend } = useContext(AuthContext)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${backend}/api/transaction-history`, {
            params: { page, limit},
            withCredentials: true
          })
          setTransaction(res.data)
        } catch (error) {
          console.log(error)
        }
      }
      fetchData()
    }, [page, limit])

    const handleNextPage = () => setPage(prevPage => prevPage + 1);
  
    const handlePreviousPage = () => setPage(prevPage => Math.max(prevPage - 1, 1));

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

            {transaction && transaction.length > 0 ? (
              transaction.map((tran, index) => (
              <tr key={index}>
                <td className="coin"> {tran.AT_transaction_type} </td>
                <td>{tran.AT_amount.toLocaleString()} {tran.AT_crypto_symbol.toUpperCase()}</td>
                <td>{new Date(tran.AT_date_time).toLocaleString()}</td>
                <td>{tran.AT_user_get.toLocaleString()} {tran.AT_crypto_symbol.toUpperCase()}</td>
                <td> {tran.AT_transactions_hash} </td>
                <td className={tran.AT_status === "pending" ? "table-status-yellow" : tran.AT_status === "success" ? "table-status-green" : "table-status-red"}> {tran.AT_status} {tran.AT_status === 'denied' ? <Link>เนื่องจาก</Link> : null} </td>
              </tr>
              ))
            ) : (
              // <p>No transactions for now</p>
              null
            )}


            </tbody>
          </table>

          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
            <span>Page {page}</span>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </div>
        </div>
    </div>
  )
}

export default Transactions
