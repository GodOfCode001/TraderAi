import React from "react";
import "./chooseUs.css";
import { useTranslation } from "react-i18next";

const ChooseUs = () => {
  const { t } = useTranslation();
  return (
    <div className="choose-us">
      <div className="choose-us-container">
        <div className="choose-us-header"> {t("choose-us")} </div>
        <div className="choose-us-body">
          <div className="card">
            <div className="card-header"> {t("choose-header1")} </div>
            <div className="card-body">
              {t("choose-body1")}
            </div>
          </div>

          <div className="card">
          <div className="card-header"> {t("choose-header2")} </div>
            <div className="card-body">
              {t("choose-body2")}
            </div>
          </div>

          <div className="card">
          <div className="card-header"> {t("choose-header3")} </div>
            <div className="card-body">
              {t("choose-body3")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseUs;
