import React, { useState } from 'react';

function FunFactsCarousel({ countryDetails }) {
  // Build an array of fun facts
  const facts = [
    countryDetails.cultureFunFact || 'No culture fun fact available.',
    countryDetails.foodFunFact || 'No food fun fact available.',
    countryDetails.personFunFact || 'No person fun fact available.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? facts.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === facts.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="fun-facts-carousel">
      <div className="carousel-container">
        <button type="button" className="arrow left-arrow" onClick={prevSlide}>
          &#9664;
        </button>
        <div className="carousel-slide">
          {facts[currentIndex]}
        </div>
        <button type="button" className="arrow right-arrow" onClick={nextSlide}>
          &#9654;
        </button>
      </div>
    </div>
  );
}

export default FunFactsCarousel;
