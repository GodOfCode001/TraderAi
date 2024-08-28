import React from 'react'
import './aboutBanner.css'
import { useTranslation } from 'react-i18next'

const AboutBanner = () => {
    const {t} = useTranslation();
  return (
    <div className='about-banner'>
        <div className="about-banner-container">
            <div className="img">
                <img src="assets/about-banner.jpg" alt="" />
            </div>
            <div className="about-banner-text">
                <div className="about-banner-header"> {t("about-banner-header")} </div>
                <div className="about-banner-body"> {t("about-banner-body")} </div>
            </div>
        </div>
    </div>
  )
}

export default AboutBanner
