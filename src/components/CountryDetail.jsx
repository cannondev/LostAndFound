import React, { useCallback, useEffect, useState } from 'react';
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
import AnimatedIcons from './AnimatedIcons';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const MIN_DISTANCE = 80;
const existingCoordinates = [];

function getValidCoordinate() {
  return new Promise((resolve) => {
    let attempts = 0;
    const MAX_ATTEMPTS = 100;
    function attempt() {
      if (attempts >= MAX_ATTEMPTS) {
        console.warn('Max attempts reached.');
        resolve({ x: 0, y: 0 });
        return;
      }
      attempts++;
      const randomX = Math.floor(Math.random() * 768);
      const randomY = Math.floor(Math.random() * 768);
      const pixelData = ctx.getImageData(randomX, randomY, 1, 1).data;
      if (pixelData[3] > 0) {
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
      attempt();
    }
    attempt();
  });
}

function CountryDetail() {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [thoughts, setThoughts] = useState([]);
  const [countryDetails, setCountryDetails] = useState(null);
  const [svgError, setSvgError] = useState(false);
  const routerLocation = useLocation();
  const [unlockMaskCleared, setUnlockMaskCleared] = useState(
    routerLocation.state?.unlockMaskCleared || false,
  );
  const lowercaseCountryId = countryId.toLowerCase();
  const countrySvgUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${lowercaseCountryId}/vector.svg`;
  const [modalOpen, setModalOpen] = useState(false);
  // Use selectedContent to store either a thought or fun fact icon
  const [selectedContent, setSelectedContent] = useState(null);
  const [funFactCoords, setFunFactCoords] = useState([]);
  const [animationKey, setAnimationKey] = useState(Date.now());

  // Fetch full country details including fun fact properties
  useEffect(() => {
    async function fetchCountryDetails() {
      try {
        const countryName = getName(countryId) || countryId;
        const response = await axios.get(
          `http://localhost:9090/api/countries/${countryName}`,
          {
            headers: { authorization: localStorage.getItem('token') },
          },
        );
        setCountryDetails(response.data.country);
      } catch (error) {
        console.error('Error fetching country details:', error);
      }
    }
    fetchCountryDetails();
  }, [countryId]);

  const openModal = async (icon) => {
    // For thought icons, fetch user info if not already populated
    if (icon.type === 'thought') {
      if (!icon.user || !icon.user.fullName) {
        try {
          // icon.user is assumed to be the user id
          const response = await axios.get(
            `http://localhost:9090/api/users/${icon.user}/info`,
            { headers: { authorization: localStorage.getItem('token') } },
          );
          // Update the icon's user field with fetched user info
          icon.user = response.data.user;
        } catch (error) {
          console.error('Error fetching user info for thought:', error);
        }
      }
    } else if (icon.type === 'funFact') {
      // For fun fact icons, ensure country details are refreshed
      try {
        const countryName = getName(countryId) || countryId;
        const response = await axios.get(
          `http://localhost:9090/api/countries/${countryName}`,
          { headers: { authorization: localStorage.getItem('token') } },
        );
        setCountryDetails(response.data.country);
      } catch (error) {
        console.error('Error fetching country details on modal open:', error);
      }
    }
    // Attach (or override) selectedContent with updated icon data
    setSelectedContent({ ...icon });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
  };

  useEffect(() => {
    const handleUnlockChange = (e) => {
      setUnlockMaskCleared(e.detail.unlockMaskCleared);
    };
    window.addEventListener('unlockStateChanged', handleUnlockChange);
    return () => window.removeEventListener('unlockStateChanged', handleUnlockChange);
  }, []);

  useEffect(() => {
    const fetchUnlockedCountries = async () => {
      try {
        const countryName = getName(countryId) || countryId;
        const response = await axios.get(
          'http://localhost:9090/api/countries/unlocked/all',
          {
            headers: { authorization: localStorage.getItem('token') },
          },
        );
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
        const response = await fetch(
          `http://localhost:9090/api/countries/${countryName}/thoughts`,
        );
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
        const categories = [
          'food',
          'culture',
          'politics',
          'language',
          'landmark',
          'history',
        ];
        existingCoordinates.length = 0;
        thoughts.forEach(({ xCoordinate, yCoordinate }) => {
          existingCoordinates.push({ x: xCoordinate, y: yCoordinate });
        });
        const coordinatePromises = categories.map(() => getValidCoordinate());
        const coords = await Promise.all(coordinatePromises);
        const funFactsData = categories.map((category, index) => ({
          category,
          xCoordinate: coords[index].x,
          yCoordinate: coords[index].y,
          type: 'funFact',
        }));
        setFunFactCoords(funFactsData);
        setAnimationKey(Date.now());
      } catch (error) {
        console.error('Error generating fun fact coordinates:', error);
      }
    }
    if (unlockMaskCleared && !svgError) {
      generateFunFactCoords();
    }
  }, [unlockMaskCleared, svgError, countrySvgUrl, thoughts]);

  const getFunFactSVG = useCallback((category) => {
    switch (category) {
      case 'food':
        return <img src={foodIcon} alt="Food Icon" width="50" height="50" />;
      case 'culture':
        return (
          <img src={cultureIcon} alt="Culture Icon" width="50" height="50" />
        );
      case 'politics':
        return (
          <img src={politicsIcon} alt="Politics Icon" width="50" height="50" />
        );
      case 'language':
        return (
          <img src={languageIcon} alt="Language Icon" width="50" height="50" />
        );
      case 'landmark':
        return (
          <img src={landmarkIcon} alt="Landmark Icon" width="50" height="50" />
        );
      case 'history':
        return (
          <img src={historyIcon} alt="History Icon" width="50" height="50" />
        );
      default:
        return null;
    }
  }, []);

  // This modalContent if structure was provided by ChatGPT to work around an eslint preference to avoid nested ternary expressions (to decide if thoguht or fun fact)
  let modalContent = 'No details available.';
  if (selectedContent) {
    if (selectedContent.type === 'thought') {
      const userFullName = selectedContent.user?.fullName || 'Unknown User';
      const userHomeCountry = selectedContent.user?.homeCountry || 'Unknown Country';
      modalContent = `${selectedContent.content}\n\n~ ${userFullName}, ${userHomeCountry}`;
    } else if (selectedContent.type === 'funFact') {
      const funFactKeyMapping = {
        food: 'foodFunFact',
        culture: 'cultureFunFact',
        politics: 'politicsFunFact', // Adjust if needed
        language: 'languageFunFact',
        landmark: 'landmarkFunFact',
        history: 'historyFunFact',
      };
      const key = funFactKeyMapping[selectedContent.category];
      const details = selectedContent.details || countryDetails;
      modalContent = details && details[key]
        ? details[key]
        : 'Fun fact still loading... come back later!';
    }
  }

  return (
    <>
      <div
        className="header"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
        }}
      >
        <button
          type="button"
          className="go-home-btn"
          onClick={() => navigate('/home')}
        >
          Back to World Map
        </button>
      </div>
      <div
        className="country-detail-display"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div style={{ position: 'relative', width: '768px', height: '768px' }}>
          <svg
            width="768"
            height="768"
            viewBox="0 0 768 768"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'block',
            }}
            preserveAspectRatio="none"
          >
            {!svgError ? (
              <image href={countrySvgUrl} width="768" height="768" />
            ) : (
              <text x="50%" y="50%" textAnchor="middle" fill="gray">
                Country shape not available.
              </text>
            )}
          </svg>
          {unlockMaskCleared && (
            <AnimatedIcons
              key={animationKey}
              thoughts={thoughts}
              funFactCoords={funFactCoords}
              unlockMaskCleared={unlockMaskCleared}
              getFunFactSVG={getFunFactSVG}
              onIconClick={openModal}
            />
          )}
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
              <p style={{ whiteSpace: 'pre-line' }}>{modalContent}</p>
              {/* <button type="button" onClick={closeModal} className="close-btn">
                Close
              </button> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CountryDetail;
