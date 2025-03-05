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

  const data = [
    { country: 'cn' }, // china
    { country: 'in' }, // india
    { country: 'us' }, // united states
    { country: 'id' }, // indonesia
    { country: 'pk', value: 210797836 }, // pakistan
    { country: 'br', value: 210301591 }, // brazil
    { country: 'ng', value: 208679114 }, // nigeria
    { country: 'bd', value: 161062905 }, // bangladesh
    { country: 'ru', value: 141944641 }, // russia
    { country: 'mx', value: 127318112 }, // mexico
  ];

  return (
    <div className="world-map-container">
      <WorldMap
        blankColor="#ffffff"
        strokeOpacity={2}
        color="purple"
        borderColor="black"
        size="xxl"
        data={data}
        onClickFunction={handleCountryClick}
      />
    </div>
  );
}

export default WorldMapComponent;
