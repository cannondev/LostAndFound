// src/components/WorldMap.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from 'react-svg-worldmap';
import '../style.scss';

function WorldMapComponent() {
  const navigate = useNavigate();

  const handleCountryClick = (countryData) => {
    if (countryData && countryData.countryCode) {
      navigate(`/country/${countryData.countryCode.toLowerCase()}`); // Ensure lowercase ISO code
    } else {
      console.error('Country data is missing or malformed:', countryData);
    }
  };

  return (
    <div className="world-map-container">
      <WorldMap
        blankColor="#ffffff"
        size="xxl"
        data={[]} // Adjust this if needed
        onClickFunction={handleCountryClick}
      />
    </div>
  );
}

export default WorldMapComponent;
