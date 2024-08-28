import React, { useState, useRef, useEffect } from 'react';
import './rankTier.css';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const RankTier = () => {
  const { t } = useTranslation();
  const cards = [
    {
      title: t('card-title.Bronze'),
      details: [
        t('card-details.investment-duration'),
        t('card-details.duration-time', { month: '1'}), 
        t('card-details.minimum-investment'),
        t('card-details.investment-amount', { amount: '3000' })
      ]
    },
    {
      title: t('card-title.Silver'),
      details: [
        t('card-details.investment-duration'),
        t('card-details.duration-time' , { month: '3'}),
        t('card-details.minimum-investment'),
        t('card-details.investment-amount', { amount: '5000' })
      ]
    },
    {
      title: t('card-title.Gold'),
      details: [
        t('card-details.investment-duration'),
        t('card-details.duration-time', { month: '6'}),
        t('card-details.minimum-investment'),
        t('card-details.investment-amount', { amount: '20000' })
      ]
    },
    {
      title: t('card-title.Platinum'),
      details: [
        t('card-details.investment-duration'),
        t('card-details.duration-time', { month: '12'}),
        t('card-details.minimum-investment'),
        t('card-details.investment-amount', { amount: '40000' })
      ]
    },
    {
      title: t('card-title.Diamond'),
      details: [
        t('card-details.investment-duration'),
        t('card-details.duration-time', { month: '12'})
      ]
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [animationDirection, setAnimationDirection] = useState("");
  const cardsPerPage = 2;
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
    <div className='rank-tier'>
      <div className="rank-tier-container">
        <div className="top">
          <div className="rank-title">
            { t('rank-title')}
          </div>
          <div className="pegination">
            <button onClick={handlePrev} disabled={currentPage === 1} className='pegination-button'>
              <FaArrowLeft />
            </button>
            <div className="rank-details" ref={currentPageRef}>
              {currentCards.map((card, index) => (
                <div className="card" key={index}>
                  <div className="card-title">{card.title}</div>
                  {card.details.map((detail, index) => (
                    <p key={index}>{detail}</p>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={handleNext} disabled={currentPage === totalPages} className='pegination-button'>
              <FaArrowRight />
            </button>
          </div>
        </div>
        <div className="bottom">

        <div className="height-card">
        <div className="height-card-title">{t('height-card-title-1')}</div>
        <div className="height-card-body">
          <div className="tier-name">{t('bronze-tier')}</div>
          <div className="tier-percentage">{t('percentage-bronze-1')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('silver-tier')}</div>
          <div className="tier-percentage">{t('percentage-silver-1')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('gold-tier')}</div>
          <div className="tier-percentage">{t('percentage-gold-1')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('platinum-tier')}</div>
          <div className="tier-percentage">{t('percentage-platinum-1')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('diamond-tier')}</div>
          <div className="tier-percentage last">{t('percentage-diamond-1')}</div>
        </div>
      </div>

      <div className="height-card">
        <div className="height-card-title">{t('height-card-title-2')}</div>
        <div className="height-card-body">
          <div className="tier-name">{t('bronze-tier')}</div>
          <div className="tier-percentage">{t('percentage-bronze-2')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('silver-tier')}</div>
          <div className="tier-percentage">{t('percentage-silver-2')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('gold-tier')}</div>
          <div className="tier-percentage">{t('percentage-gold-2')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('platinum-tier')}</div>
          <div className="tier-percentage">{t('percentage-platinum-2')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('diamond-tier')}</div>
          <div className="tier-percentage last">{t('percentage-diamond-2')}</div>
        </div>
      </div>

      <div className="height-card">
        <div className="height-card-title">{t('height-card-title-3')}</div>
        <div className="height-card-body">
          <div className="tier-name">{t('bronze-tier')}</div>
          <div className="tier-percentage">{t('percentage-bronze-3')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('silver-tier')}</div>
          <div className="tier-percentage">{t('percentage-silver-3')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('gold-tier')}</div>
          <div className="tier-percentage">{t('percentage-gold-3')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('platinum-tier')}</div>
          <div className="tier-percentage">{t('percentage-platinum-3')}</div>
        </div>
        <div className="height-card-body">
          <div className="tier-name">{t('diamond-tier')}</div>
          <div className="tier-percentage last">{t('percentage-diamond-3')}</div>
        </div>
      </div>


        </div>
      </div>
    </div>
  );
}

export default RankTier;
