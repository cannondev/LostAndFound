/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import * as d3 from 'd3';
import '../style.scss';
import countryShapes from 'world-map-country-shapes';

function CountryInfo() {
  const { country } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [countryData, setCountryData] = useState(null);
  const [countryShape, setCountryShape] = useState(null);
  // const svgRef = useRef();

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const data = await response.json();
        setCountryData(data[0]);

        const isoCode = data[0]?.cca2;
        const shapeData = countryShapes.find((c) => c.id === isoCode);
        if (shapeData) {
          setCountryShape(shapeData.shape);
        } else {
          console.error(`Shape not found for country with ISO code: ${isoCode}`);
        }
      } catch (error) {
        console.error('Error fetching country info:', error);
      }
    };

    fetchCountryInfo();
  }, [country]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (!countryData) return <div>Loading...</div>;

  return (
    <div className="country-info">
      <button className="go-home-btn" onClick={handleGoHome}>
        Go Back to Home
      </button>

      <h1>{countryData.name.common}</h1>
      <p>Capital: {countryData.capital}</p>
      <p>Population: {countryData.population}</p>
      <p>Region: {countryData.region}</p>

      <div className="map-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
          {countryShape ? (
            <path
              d={countryShape}
              style={{
                fill: '#FF5722',
                stroke: '#FFFFFF',
                strokeWidth: 1.5,
              }}
            />
          ) : (
            <>
              <text x="50%" y="50%" textAnchor="middle" fill="gray">
                Country shape not available.
              </text>
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                fill="#FF5722"
                style={{ cursor: 'pointer' }}
                onClick={handleGoHome}
              >
                Go Back
              </text>
            </>
          )}
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
          {countryShape ? (
            <path
              d={countryShape}
              style={{
                fill: '#FF5722',
                stroke: '#FFFFFF',
                strokeWidth: 1.5,
              }}
            />
          ) : null}
        </svg>
        {!countryShape && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: 'gray' }}>Country shape not available.</p>
            <button className="go-home-btn" onClick={handleGoHome}>
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountryInfo;
