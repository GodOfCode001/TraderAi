import React, { useContext, useEffect, useState } from 'react'
import './feature.css'
import axios from 'axios'
import { FiArrowUpRight, FiArrowDown } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../context/AuthContext'

const Feature = ({data}) => {
    const { t } = useTranslation()
    // console.log(data)
    // const [data, setData] = useState(null)
    const { backend } = useContext(AuthContext)
    // console.log(data)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await axios.get(`${backend}/api/coins/get`)
    //         console.log(res.data)
    //         setData(res.data)
    //     }
    //     fetchData()
    // }, [])

    if (!data) return null

  return (
    <div className='feature'>
        <div className="feature-container">

        <div className='left'>
                <h2> { t("feature-header") } </h2>
                <p> { t('feature-sub')} </p>
                <button className='btn'> {t("more-coin")} </button>
            </div>

            {/* Right */}

            <div className='right'>
              <div className='card'>
                <div className='top'>
                    <img src={data[0].coin_img_path} alt={t('image-alt')}/>
                </div>
                <div>
                    <h5> {data[0].coin_name} </h5>
                    <p> ${data[0].coin_price} </p>
                </div>

                {data[0].coin_change_percentage < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {parseFloat(data[0].coin_change_percentage).toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {parseFloat(data[0].coin_change_percentage).toFixed(2)}%
                    </span>
                )}
              </div>

              <div className='card'>
                <div className='top'>
                    <img src={data[1].coin_img_path} alt={t('image-alt')}/>
                </div>
                <div>
                    <h5> {data[1].coin_name} </h5>
                    <p> ${data[1].coin_price} </p>
                </div>

                {data[1].coin_change_percentage < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {parseFloat(data[1].coin_change_percentage).toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {parseFloat(data[1].coin_change_percentage).toFixed(2)}%
                    </span>
                )}
              </div>
              
              <div className='card'>
                <div className='top'>
                    <img src={data[2].coin_img_path} alt={t('image-alt')}/>
                </div>
                <div>
                    <h5> {data[2].coin_name} </h5>
                    <p> ${data[2].coin_price} </p>
                </div>

                {data[2].coin_change_percentage < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {parseFloat(data[2].coin_change_percentage).toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {parseFloat(data[2].coin_change_percentage).toFixed(2)}%
                    </span>
                )}
              </div>

              <div className='card'>
                <div className='top'>
                    <img src={data[3].coin_img_path} alt={t('image-alt')}/>
                </div>
                <div>
                    <h5> {data[3].coin_name} </h5>
                    <p> ${data[3].coin_price} </p>
                </div>

                {data[3].coin_change_percentage < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {parseFloat(data[3].coin_change_percentage).toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {parseFloat(data[3].coin_change_percentage).toFixed(2)}%
                    </span>
                )}
              </div>
              <div className='card'>
                <div className='top'>
                    <img src={data[4].coin_img_path} alt={t('image-alt')}/>
                </div>
                <div>
                    <h5> {data[4].coin_name} </h5>
                    <p> ${data[4].coin_price} </p>
                </div>

                {data[4].coin_change_percentage < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {parseFloat(data[4].coin_change_percentage).toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {parseFloat(data[4].coin_change_percentage).toFixed(2)}%
                    </span>
                )}
              </div>
            
              <div className='card'>
                <div className='top'>
                    <img src={data[5].coin_img_path} alt={t('image-alt')}/>
                </div>
                <div>
                    <h5> {data[5].coin_name} </h5>
                    <p> ${data[5].coin_price} </p>
                </div>

                {data[5].coin_change_percentage < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {parseFloat(data[5].coin_change_percentage).toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {parseFloat(data[5].coin_change_percentage).toFixed(2)}%
                    </span>
                )}
              </div>

              {/* <div className='card'>
                <div className='top'>
                    <img src={data[1].image} alt='/'/>
                </div>
                <div>
                    <h5> {data[1].name} </h5>
                    <p> ${data[1].current_price.toLocaleString()} </p>
                </div>

                {data[1].price_change_percentage_24h < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {data[1].price_change_percentage_24h.toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {data[1].price_change_percentage_24h.toFixed(2)}%
                    </span>
                )}
              </div>

              <div className='card'>
                <div className='top'>
                    <img src={data[2].image} alt='/'/>
                </div>
                <div>
                    <h5> {data[2].name} </h5>
                    <p> ${data[2].current_price.toLocaleString()} </p>
                </div>

                {data[2].price_change_percentage_24h < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {data[2].price_change_percentage_24h.toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {data[2].price_change_percentage_24h.toFixed(2)}%
                    </span>
                )}
              </div>

              <div className='card'>
                <div className='top'>
                    <img src={data[3].image} alt='/'/>
                </div>
                <div>
                    <h5> {data[3].name} </h5>
                    <p> ${data[3].current_price.toLocaleString()} </p>
                </div>

                {data[3].price_change_percentage_24h < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {data[3].price_change_percentage_24h.toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {data[3].price_change_percentage_24h.toFixed(2)}%
                    </span>
                )}
              </div>

              <div className='card'>
                <div className='top'>
                    <img src={data[4].image} alt='/'/>
                </div>
                <div>
                    <h5> {data[4].name} </h5>
                    <p> ${data[4].current_price.toLocaleString()} </p>
                </div>

                {data[4].price_change_percentage_24h < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {data[4].price_change_percentage_24h.toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {data[4].price_change_percentage_24h.toFixed(2)}%
                    </span>
                )}
              </div>

              <div className='card'>
                <div className='top'>
                    <img src={data[5].image} alt='/'/>
                </div>
                <div>
                    <h5> {data[5].name} </h5>
                    <p> ${data[5].current_price.toLocaleString()} </p>
                </div>

                {data[5].price_change_percentage_24h < 0  ? (
                    <span className='red'>
                        <FiArrowDown className='icon'/>
                        {data[5].price_change_percentage_24h.toFixed(2)}%
                    </span>
                ) : (
                    <span className='green'>
                        <FiArrowUpRight className='icon'/>
                        {data[5].price_change_percentage_24h.toFixed(2)}%
                    </span>
                )}
              </div> */}
            </div>

        </div>
    </div>
  )
}

export default Feature
