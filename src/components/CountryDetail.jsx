// src/components/CountryDetail.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style.scss';

function CountryDetail() {
  const { countryId } = useParams();
  const navigate = useNavigate();

  // Convert country code to lowercase to match mapsicon format
  const lowercaseCountryId = countryId.toLowerCase();

  // Construct the URL for the country SVG from mapsicon repository
  const countrySvgUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${lowercaseCountryId}/vector.svg`;

  return (
    <div className="country-detail">
      <button type="button" className="go-home-btn" onClick={() => navigate('/')}>
        Go Back to Home
      </button>
      <div className="country-container">
        <img
          src={countrySvgUrl}
          alt={countryId}
          width="768"
          height="768"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

      </div>
    </div>
  );
}

export default CountryDetail;
