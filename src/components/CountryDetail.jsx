import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../style.scss';
import { getName } from 'country-list';
import axios from 'axios';
import foodIcon from '../images/cuisine.png';
import cultureIcon from '../images/culture.png';
import politicsIcon from '../images/politics.png';
import languageIcon from '../images/languages.png';
import landmarkIcon from '../images/landmark.png';
import historyIcon from '../images/history.png';
import plane from '../images/paper-airplane.png';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const MIN_DISTANCE = 60; // Minimum distance between icons
const existingCoordinates = []; // Store both fun fact and paper airplane coordinates

// Helper function: returns a valid coordinate inside the country shape.
function getValidCoordinate() {
  return new Promise((resolve) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 100; // Avoid infinite loops

    function attempt() {
      if (attempts >= MAX_ATTEMPTS) {
        console.warn('Max attempts reached, could not find non-overlapping coordinate.');
        resolve({ x: 0, y: 0 }); // Fallback to top-left corner
        return;
      }
      attempts++;

      const randomX = Math.floor(Math.random() * 768);
      const randomY = Math.floor(Math.random() * 768);
      const pixelData = ctx.getImageData(randomX, randomY, 1, 1).data;

      if (pixelData[3] > 0) { // Check if inside the country shape
        const isTooClose = existingCoordinates.some(({ x, y }) => {
          const distance = Math.sqrt((randomX - x) ** 2 + (randomY - y) ** 2);
          return distance < MIN_DISTANCE;
        });

        if (!isTooClose) {
          existingCoordinates.push({ x: randomX, y: randomY });
          resolve({ x: randomX, y: randomY });
          return;
        }
      }
      attempt(); // Retry if too close or outside shape
    }
    attempt();
  });
}

function CountryDetail() {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [thoughts, setThoughts] = useState([]);
  const [svgError, setSvgError] = useState(false);
  const routerLocation = useLocation();
  const [unlockMaskCleared, setUnlockMaskCleared] = useState(routerLocation.state?.unlockMaskCleared || false);
  const lowercaseCountryId = countryId.toLowerCase();
  const countrySvgUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${lowercaseCountryId}/vector.svg`;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedThought, setSelectedThought] = useState(null);
  const [funFactCoords, setFunFactCoords] = useState([]); // New state for fun fact icons

  const openModal = (thought) => {
    setSelectedThought(thought);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedThought(null);
  };

  useEffect(() => {
    const handleUnlockChange = (e) => {
      setUnlockMaskCleared(e.detail.unlockMaskCleared);
    };
    window.addEventListener('unlockStateChanged', handleUnlockChange);
    return () => window.removeEventListener('unlockStateChanged', handleUnlockChange);
  }, []);

  // Fetch user's unlocked countries from the backend
  useEffect(() => {
    const fetchUnlockedCountries = async () => {
      try {
        const countryName = getName(countryId) || countryId;
        const response = await axios.get('http://localhost:9090/api/countries/unlocked/all', {
          headers: { authorization: localStorage.getItem('token') },
        });
        const unlockedCountries = response.data.unlockedCountries || [];
        if (unlockedCountries.includes(countryName)) {
          setUnlockMaskCleared(true);
        }
      } catch (error) {
        console.error('Error fetching unlocked countries:', error);
      }
    };

    fetchUnlockedCountries();
  }, [countryId]);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const countryName = getName(countryId) || countryId;
        const response = await fetch(`http://localhost:9090/api/countries/${countryName}/thoughts`);
        if (!response.ok) throw new Error('Failed to fetch thoughts');
        const data = await response.json();
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
    img.onload = () => setSvgError(false);
    img.onerror = () => setSvgError(true);
  }, [countrySvgUrl]);

  // New useEffect: generate 6 fun fact coordinates once the country is unlocked and the SVG is loaded
  useEffect(() => {
    async function generateFunFactCoords() {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = countrySvgUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        canvas.width = 768;
        canvas.height = 768;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const categories = ['food', 'culture', 'politics', 'language', 'landmark', 'history'];
        existingCoordinates.length = 0;
        thoughts.forEach(({ xCoordinate, yCoordinate }) => {
          existingCoordinates.push({ x: xCoordinate, y: yCoordinate });
        });
        // Generate a valid coordinate for each category.
        const coordinatePromises = categories.map(() => getValidCoordinate());
        const coords = await Promise.all(coordinatePromises);
        const funFacts = categories.map((category, index) => ({
          category,
          xCoordinate: coords[index].x,
          yCoordinate: coords[index].y,
        }));
        setFunFactCoords(funFacts);
      } catch (error) {
        console.error('Error generating fun fact coordinates:', error);
      }
    }

    if (unlockMaskCleared && !svgError) {
      generateFunFactCoords();
    }
  }, [unlockMaskCleared, svgError, countrySvgUrl]);

  function getFunFactSVG(category) {
    switch (category) {
      case 'food':
        return <img src={foodIcon} alt="Food Icon" width="50" height="50" />;
      case 'culture':
        return <img src={cultureIcon} alt="Culture Icon" width="50" height="50" />;
      case 'politics':
        return <img src={politicsIcon} alt="Politics Icon" width="50" height="50" />;
      case 'language':
        return <img src={languageIcon} alt="Language Icon" width="50" height="50" />;
      case 'landmark':
        return <img src={landmarkIcon} alt="Landmark Icon" width="50" height="50" />;
      case 'history':
        return <img src={historyIcon} alt="History Icon" width="50" height="50" />;
      default:
        return null;
    }
  }

  return (
    <div className="country-detail-display">
      <div className="header">
        <button type="button" className="go-home-btn" onClick={() => navigate('/home')}>
          Go Back to Home
        </button>
      </div>

      <div className="country-container" style={{ position: 'relative', width: 768, height: 768 }}>
        <svg width="768" height="768" viewBox="0 0 768 768">
          {!svgError ? (
            <image
              href={countrySvgUrl}
              width="100%"
              height="100%"
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <text x="50%" y="50%" textAnchor="middle" fill="gray">
              Country shape not available.
            </text>
          )}
        </svg>

        {/* Render thought icons with backend-provided coordinates */}
        {unlockMaskCleared && thoughts.map((thought) => (
          <div
            key={thought._id}
            role="button"
            tabIndex={0}
            aria-label="View thought details"
            style={{
              position: 'absolute',
              top: thought.yCoordinate,
              left: thought.xCoordinate,
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
              cursor: 'pointer',
            }}
            onClick={() => openModal(thought)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openModal(thought);
              }
            }}
          >
            <img
              src={plane}
              alt="Paper Airplane Icon"
              width="50"
              height="50"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        ))}

        {/* Render the 6 fun fact icons with randomly generated coordinates */}
        {unlockMaskCleared && funFactCoords.map((fact) => (
          <div
            key={fact.category}
            role="button"
            tabIndex="0" // Make the element focusable
            style={{
              position: 'absolute',
              top: fact.yCoordinate,
              left: fact.xCoordinate,
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              cursor: 'pointer',
            }}
            onClick={() => console.log(`Clicked on ${fact.category} icon`)}
          >
            {getFunFactSVG(fact.category)}
          </div>

        ))}
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          role="button"
          tabIndex={0}
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') closeModal();
          }}
        >
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <p>{selectedThought?.content || 'No details available.'}</p>
            <button
              type="button"
              onClick={closeModal}
              className="close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CountryDetail;
