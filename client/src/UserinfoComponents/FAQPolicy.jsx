import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import './FAQPolicy.css'
import { useTranslation } from "react-i18next";

const FAQPolicy = () => {
    const { t } = useTranslation();

    const cards = [
        {
          title: t('faq-heading1'),
          details: t('faq-details1'),
        },
        {
          title: t('faq-heading2'),
          details: t('faq-details2'),
        },
        {
          title: t('faq-heading3'),
          details: t('faq-details3'),
        },
        {
          title: t('faq-heading4'),
          details: t('faq-details4'),
        },
        {
          title: t('faq-heading5'),
          details: t('faq-details5'),
        },
        {
          title: t('faq-heading6'),
          details: t('faq-details6'),
        },
    ]

    const [currentPage, setCurrentPage] = useState(1);
    const [animationDirection, setAnimationDirection] = useState("");
    const cardsPerPage = 3;
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const currentPageRef = useRef(null);
  
    const startIndex = (currentPage - 1) * cardsPerPage;
    const currentCards = cards.slice(startIndex, startIndex + cardsPerPage);

    const handlePageChange = (newPage, direction) => {
        setAnimationDirection(direction);
        setCurrentPage(newPage);
      };
    
      const handleNext = () => {
        if (currentPage < totalPages) {
          handlePageChange(currentPage + 1, "nextPage");
        }
      };
    
      const handlePrev = () => {
        if (currentPage > 1) {
          handlePageChange(currentPage - 1, "prevPage");
        }
      };
    
      useEffect(() => {
        if (animationDirection && currentPageRef.current) {
          currentPageRef.current.style.animation = `${animationDirection} 0.2s forwards`;
    
          const handleAnimationEnd = () => {
            currentPageRef.current.style.animation = "";
            setAnimationDirection(""); // Reset the direction after animation
          };
    
          currentPageRef.current.addEventListener("animationend", handleAnimationEnd);
    
          return () => {
            currentPageRef.current.removeEventListener("animationend", handleAnimationEnd);
          };
        }
      }, [animationDirection, currentPage]);
  return (
    <div className='FAQPolicy'>
      <div className="FAQPolicy-container">

      <div className="policy">
      <div className="policy-us-container">
        {/* <div className="choose-us-header"> {t("choose-us")} </div> */}
        <div className="choose-us-header"> Policy </div>
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

    <div className='about-faq'>
      <div className="about-faq-container">

        <div className="about-faq-header">
            {t("faq")}
        </div>

        <div className="about-faq-body">

          <div className="pegination">
            <button onClick={handlePrev} disabled={currentPage === 1} className='pegination-button'>
              <FaArrowLeft />
            </button>
            <div className="card-com" ref={currentPageRef}>
              {currentCards.map((card, index) => (
                <div className="card" key={index}>
                  <div className="faq-heading">{card.title}</div>
                  <div className="faq-body"> {card.details} </div>
                  <button className='read-more'> {t("read-more")} </button>
                </div>
              ))}
            </div>
            <button onClick={handleNext} disabled={currentPage === totalPages} className='pegination-button'>
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  )
}

export default FAQPolicy
