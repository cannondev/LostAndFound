import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WorldMap from 'react-svg-worldmap';
import useStore from '../store';
import countryNameToISO from '../utils/countryNameToISO';

const getRandomColor = () => {
  const pastelColors = [
    '#FFC0CB',
    '#FFB6C1',
    '#FFD1DC',
    '#E6A8D7',
    '#D8BFD8',
    '#E0BBE4',
    '#C3B1E1',
    '#DDA0DD',
    '#B19CD9',
    '#F4C2C2',
  ];
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
};

function WorldMapComponent() {
  const navigate = useNavigate();
  const user = useStore(({ authSlice }) => authSlice.user);
  const [data, setData] = useState([]);
  const fetchAllUnlockedCountries = useStore((state) => state.passportSlice.fetchAllUnlockedCountries);
  const unlockedCountries = useStore((state) => state.passportSlice.countriesVisited);

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
          return isoCode ? { country: isoCode, value: Math.random(), color: getRandomColor() } : null;
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
        styleFunction={({ countryValue, countryCode }) => ({
          fill: data.find((c) => c.country === countryCode)?.color || 'white',
          stroke: 'black',
          strokeWidth: 0.5,
        })}
      />
    </div>
  );
}

export default WorldMapComponent;
