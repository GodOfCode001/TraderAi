import React from 'react'
import { useTranslation } from 'react-i18next';
import './earn.css'
const Earn = () => {
  const { t } = useTranslation();

  return (
    <div className='earn'>
        <div className="earn-container">
            <h1> {t("earn-header")} </h1>
            <p> {t("earn-sub")} </p>
            <div className="buttons">
                <button> {t("login")} </button>
                <button> {t("register")} </button>
            </div>
        </div>
    </div>
  )
}

export default Earn
