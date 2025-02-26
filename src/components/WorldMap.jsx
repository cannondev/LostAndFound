// src/components/WorldMap.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import countryShapes from 'world-map-country-shapes';
import '../style.scss';

function WorldMap() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleCountryClick = (countryId) => {
    setSelectedCountry(countryId);
    navigate(`/country/${countryId}`);
  };

  return (
    <div className="world-map-container">
      <svg xmlns="http://www.w3.org/2000/svg" height="600" width="1200" viewBox="0 0 2000 1001">
        {countryShapes.map((country) => (
          <path
            key={country.id}
            d={country.shape}
            style={{
              fill: selectedCountry === country.id ? '#FF5722' : '#e0e0e0',
              stroke: '#FFFFFF',
              strokeWidth: 1,
              cursor: 'pointer',
            }}
            onClick={() => handleCountryClick(country.id)}
          />
        ))}
      </svg>
    </div>
  );
}

export default WorldMap;
