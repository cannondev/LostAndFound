// src/components/CountryDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style.scss';
import { getName } from 'country-list';

function CountryDetail() {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [thoughts, setThoughts] = useState([]);
  const [svgError, setSvgError] = useState(false);

  // Convert country code to lowercase to match mapsicon format
  const lowercaseCountryId = countryId.toLowerCase();

  // Construct the URL for the country SVG from mapsicon repository
  const countrySvgUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${lowercaseCountryId}/vector.svg`;

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const countryName = getName(countryId) || countryId;
        console.log('🛠 Fetching thoughts for country:', countryName);
        const response = await fetch(`http://localhost:9090/api/countries/${countryName}/thoughts`);
        if (!response.ok) throw new Error('Failed to fetch thoughts');
        const data = await response.json();
        console.log('Thoughts fetched from backend:', data);
        setThoughts(data);
      } catch (error) {
        console.error('Error fetching thoughts:', error);
      }
    };

    fetchThoughts();
  }, [countryId]);

  useEffect(() => {
    const img = new Image();
    img.src = countrySvgUrl;
    img.onload = () => setSvgError(false); // Successfully loaded
    img.onerror = () => setSvgError(true); // Failed to load
  }, [countrySvgUrl]);

  return (
    <div className="country-detail">
      <div className="header">
        <button type="button" className="go-home-btn" onClick={() => navigate('/')}>
          Go Back to Home
        </button>
      </div>

      <div className="country-container">
        <svg
          width="768"
          height="768"
          viewBox="0 0 768 768"
        >
          {!svgError ? (
            <image
              href={countrySvgUrl}
              width="100%"
              height="100%"
              style={{
                objectFit: 'contain',
              }}
            />
          ) : (
            <text x="50%" y="50%" textAnchor="middle" fill="gray">
              Country shape not available.
            </text>
          )}

          {/* Render Icons at Thought Coordinates */}
          {thoughts.map((thought) => {
            const scaledX = thought.xCoordinate;
            const scaledY = thought.yCoordinate;

            console.log(`Placing thought at (${scaledX}, ${scaledY})`);
            return (
              <g key={thought._id} transform={`translate(${scaledX}, ${scaledY}) scale(0.3)`} style={{ zIndex: 2, pointerEvents: 'auto,' }}>
                <path d="
                M 2.849 87.151 c -0.801 -0.801 -0.8 -2.099 0 -2.899 l 29.441 -29.441 c 0.8 -0.8 2.098 -0.801 2.899 0 s 0.8 2.099 0 2.899
                L 5.748 87.151 C 4.947 87.952 3.649 87.952 2.849 87.151 z"
                  fill="rgb(80,211,161)"
                />
                <path d="
                M 0.916 65.892 c -0.801 -0.801 -0.8 -2.099 0 -2.899
                l 11.08 -11.08 c 0.8 -0.8 2.098 -0.801 2.899 0 c 0.801 0.801 0.8 2.099 0 2.899 l -11.08 11.08 C 3.015 66.692 1.717 66.692 0.916 65.892 z"
                  fill="rgb(80,211,161)"
                />
                <path d="
                M 24.108 89.084 c -0.8 -0.8 -0.8 -2.099 0 -2.899 l 11.08 -11.08 c 0.8 -0.8 2.099 -0.8 2.899 0
                c 0.8 0.8 0.8 2.099 0 2.899 l -11.08 11.08 C 26.207 89.884 24.909 89.884 24.108 89.084 z"
                  fill="rgb(80,211,161)"
                />
                <path d="
                M 89.399 0.601 c -0.53 -0.53 -1.306 -0.729 -2.025 -0.518 L 1.475 25.207 c -0.778 0.228 -1.348 0.891 -1.457 1.693 c -0.086 0.642 0.136 1.278 0.582 1.724
                c 0.11 0.11 0.235 0.21 0.372 0.294 l 25.292 15.628 c 0.436 0.269 0.956 0.365 1.459 0.27 l 21.538 -4.079 C 65.667 32.684 78.597 18.514 89.399 0.601 z"
                  fill="rgb(80,211,161)"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default CountryDetail;
