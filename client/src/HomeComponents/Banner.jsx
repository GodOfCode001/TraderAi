import React from 'react'
import './banner.css'
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const { t } = useTranslation();

  return (
    <div className='banner'>
        <div className="banner-container">
            <h1> {t("banner-header")} </h1>
            <p> {t("banner-sub")} </p>
            <button> {t("read-more")} </button>
        </div>
    </div>
  )
}

export default Banner
