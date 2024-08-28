import React from 'react'
import './rankBanner.css'
import { useTranslation } from 'react-i18next'

const RankBanner = () => {
    const { t } = useTranslation();
    
  return (
    <div className='rank-banner'>
      <div className="rank-banner-container">
        <div className="left">
            <img src="https://images.unsplash.com/flagged/photo-1578928534298-9747fc52ec97?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
        </div>
        <div className="right">
            <div className="rebate-header">
                { t("rebate-class") }
            </div>
            <div className="rebate-body">
                <div className="bronze">
                    <div className='text'>B</div>
                    <div className="b-candle"></div>
                </div>

                <div className="silver">
                    <div className='text'>S</div>
                    <div className="s-candle"></div>
                </div>

                <div className="gold">
                    <div className='text'>G</div>
                    <div className="g-candle"></div>
                </div>

                <div className="platinum">
                    <div className='text'>P</div>
                    <div className="p-candle"></div>
                </div>

                <div className="diamond">
                    <div className='text'>D</div>
                    <div className="d-candle"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RankBanner
