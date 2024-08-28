import React from 'react'
import { useTranslation } from 'react-i18next';
import './tradingStatement.css'

const TradingStatement = () => {
    const { t } = useTranslation();
  return (

    <div className='trading-statements'>
      <div className="trading-statements-container">
        
        <div className="deposit-details">
          <div className="details-header">
            <div className="left"> Trading Statements </div>
            <div className="right">
              <input type="checkbox" />
              show only win statement
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th> statementId </th>
                <th> symbol </th>
                <th> assets </th>
                <th> time </th>
                <th> income </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="coin"># 1</td>
              
              <td> BTCUSDT </td>
                <td> USDT </td>
                <td>11/07/2024 14:41:26</td>
                <td className="table-status-green">0.05292</td>
              </tr>
              <tr>
                <td className="coin"># 1</td>
                <td> BTCUSDT </td>
                <td>USDT </td>
                <td>11/07/2024 13:50:10</td>
                <td className="table-status-green">10.0228</td>
              </tr>
              <tr>
                <td className="coin"># 1</td>
                <td> BTCUSDT </td>
                <td>USDT </td>
                <td>11/07/2024 12:21:10</td>
                <td className="table-status-red">-0.04046 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TradingStatement
