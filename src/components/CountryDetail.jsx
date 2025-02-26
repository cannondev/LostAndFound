// src/components/CountryDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import countryShapes from 'world-map-country-shapes';
import '../style.scss';
// import countries from '../data/countries.json'; // Optional static data

function CountryDetail() {
  const { countryId } = useParams();
  const navigate = useNavigate();

  const shapeData = countryShapes.find((c) => c.id === countryId);
  // const countryInfo = countries.find((c) => c.id === countryId); // If you add static data

  return (
    <div className="country-detail">
      <button type="button" className="go-home-btn" onClick={() => navigate('/')}>
        Go Back to Home
      </button>
      {/* {countryInfo ? (
        <>
          <h1>{countryInfo.name}</h1>
          <p>Capital: {countryInfo.capital}</p>
          <p>Population: {countryInfo.population.toLocaleString()}</p>
          <p>Region: {countryInfo.region}</p>
        </>
      ) : (
        <p>Country information not available.</p>
      )} */}
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 2000 1001">
        {shapeData ? (
          <path
            d={shapeData.shape}
            style={{
              fill: '#FF5722',
              stroke: '#FFFFFF',
              strokeWidth: 1.5,
            }}
          />
        ) : (
          <text x="50%" y="50%" textAnchor="middle" fill="gray">
            Country shape not available.
          </text>
        )}
      </svg>
    </div>
  );
}

export default CountryDetail;
