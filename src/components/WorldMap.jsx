import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import WorldMap from 'react-svg-worldmap';
// import { getName } from 'country-list';
import useStore from '../store';
import countryNameToISO from '../utils/countryNameToISO';

const ROOT_URL = 'https://project-api-lost-and-found-9lyg.onrender.com/api';

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

  // Helper to get auth headers
  const getAuthHeaders = () => ({
    headers: { authorization: localStorage.getItem('token') },
  });

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

  // New async handler for when a country is clicked
  const handleCountryClick = async ({ countryCode }) => {
    // Convert the ISO code to a full country name using getName (if needed by the API)
    // const countryName = getName(countryCode.toUpperCase());
    try {
      console.log('try country click');
      // Navigate to the country detail page (using the lowercase iso code)
      navigate(`/country/${countryCode.toLowerCase()}`);
      const generateResponse = await axios.post(
        `${ROOT_URL}/countries/Brazil/generate-data`,
        {},
        getAuthHeaders(),
      );
      console.log('Country generated response:', generateResponse);
    } catch (error) {
      console.error('Error generating country data:', error.response?.data || error.message);
    }
  };

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
