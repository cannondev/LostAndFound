import React, { useState } from 'react';

function ThoughtsCarousel({ countryDetails }) {
  // Build an array of formatted thought strings from the thoughts array only.
  const formattedThoughts = Array.isArray(countryDetails.thoughts) && countryDetails.thoughts.length > 0
    ? countryDetails.thoughts.map((thought) => {
      const userFullName = thought.user && thought.user.fullName ? thought.user.fullName : 'Unknown User';
      const userHomeCountry = thought.user && thought.user.homeCountry ? thought.user.homeCountry : 'Unknown Country';
      return `${thought.content}\n\n${userFullName}, ${userHomeCountry}`;
    })
    : ['No thoughts found.'];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? formattedThoughts.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === formattedThoughts.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="thoughts-carousel">
      <div className="carousel-container">
        <button type="button" className="arrow left-arrow" onClick={prevSlide}>
          &#9664;
        </button>
        <div className="carousel-slide">
          {/* Using <pre> to preserve line breaks */}
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {formattedThoughts[currentIndex]}
          </pre>
        </div>
        <button type="button" className="arrow right-arrow" onClick={nextSlide}>
          &#9654;
        </button>
      </div>
    </div>
  );
}

export default ThoughtsCarousel;
