/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CountryInfo.css';

function CountryInfo() {
  const { country } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [countryData, setCountryData] = useState(null);
  const [circlePosition, setCirclePosition] = useState({ x: 50, y: 50 });
  const [scratched, setScratched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        setCountryData(data[0]);
      } catch (error) {
        console.error('Error fetching country info:', error);
      }
    };

    fetchCountryInfo();
  }, [country]);

  const handleMouseDown = (e) => {
    const offsetX = e.clientX - circlePosition.x;
    const offsetY = e.clientY - circlePosition.y;
    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setCirclePosition({ x: newX, y: newY });

      if (newX >= 150 && newX <= 250 && newY >= 150 && newY <= 250) {
        setScratched(true);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Go Back button navigates to Home (which refetches country data)
  const handleGoHome = () => {
    navigate('/');
  };

  if (!countryData) return <div>Loading...</div>;

  return (
    <div
      className="country-info"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <button className="go-home-btn" onClick={handleGoHome}>
        Go Back to Home
      </button>

      <h1>{countryData.name.common}</h1>
      <p>Capital: {countryData.capital}</p>
      <p>Population: {countryData.population}</p>
      <p>Region: {countryData.region}</p>

      <div className="container">
        <div
          className="square"
          style={{
            width: 100,
            height: 100,
            backgroundColor: scratched ? 'blue' : 'black',
            top: 150,
            left: 150,
          }}
        />
        <div
          className="circle"
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'orange',
            borderRadius: '50%',
            position: 'absolute',
            top: circlePosition.y - 25,
            left: circlePosition.x - 25,
            cursor: 'pointer',
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
}

export default CountryInfo;
