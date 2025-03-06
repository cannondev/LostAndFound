import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from 'react-svg-worldmap';
import useStore from '../store';
import countryNameToISO from '../utils/countryNameToISO';

function WorldMapComponent() {
  const navigate = useNavigate();
  const user = useStore(({ authSlice }) => authSlice.user);
  const [data, setData] = useState([]);
  const fetchAllUnlockedCountries = useStore((state) => state.passportSlice.fetchAllUnlockedCountries);
  const unlockedCountries = useStore((state) => state.passportSlice.countriesVisited); // Assuming this stores the countries data

  useEffect(() => {
    if (fetchAllUnlockedCountries) {
      fetchAllUnlockedCountries();
    }
  }, [user, fetchAllUnlockedCountries]);

  useEffect(() => {
    if (unlockedCountries && unlockedCountries.length > 0) {
      const newData = unlockedCountries
        .map((countryName) => {
          const isoCode = countryNameToISO(countryName);
          return isoCode ? { country: isoCode, value: 1 } : null;
        })
        .filter(Boolean);
      setData(newData);
    }
  }, [unlockedCountries]);

  return (
    <div className="world-map-container">
      <WorldMap
        blankColor="#ffffff"
        strokeOpacity={2}
        color="purple"
        borderColor="black"
        size="xxl"
        data={data}
        onClickFunction={({ countryCode }) => navigate(`/country/${countryCode.toLowerCase()}`)}
      />
    </div>
  );
}

export default WorldMapComponent;
