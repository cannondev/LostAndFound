import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { getName } from 'country-list';
import axios from 'axios';
import { toast } from 'react-toastify';
import useStore from '../store';
import Scratch from '../images/Scratch.jpeg';

// Helper for auth headers.
const getAuthHeaders = () => ({
  headers: { authorization: localStorage.getItem('token') },
});

function CountryScratchOff() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/');
  const countryId = pathParts[2];
  const countryName = getName(countryId) || countryId;

  // Local state.
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isScratching, setIsScratching] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [maskCleared, setMaskCleared] = useState(false);
  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const authenticated = useStore(({ authSlice }) => authSlice.authenticated);

  // Create an offscreen canvas.
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 768;
    canvasRef.current = canvas;
  }, []);

  // On mount, check backend if country is already unlocked.
  useEffect(() => {
    axios.get('http://localhost:9090/api/countries/unlocked/all', getAuthHeaders())
      .then((response) => {
        const unlockedCountries = response.data.unlockedCountries || [];
        if (unlockedCountries.includes(countryName)) {
          setUnlocked(true);
          setMaskCleared(true);
          navigate(`/country/${countryId}`);
        }
      })
      .catch((error) => console.error('Error fetching unlocked countries:', error));
  }, [countryName, countryId, navigate]);

  // Load scratch paths from backend.
  useEffect(() => {
    axios.get(`http://localhost:9090/api/countries/${countryName}/scratch`, getAuthHeaders())
      .then((response) => {
        if (response.data && response.data.paths) {
          setPaths(response.data.paths);
        }
      })
      .catch((error) => console.error('Error fetching scratch data:', error));
  }, [countryName]);

  // Calculate scratch progress.
  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 50;
    ctx.lineCap = 'round';
    paths.forEach((path) => {
      if (path.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    let blackCount = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 10 && data[i + 1] < 10 && data[i + 2] < 10) {
        blackCount++;
      }
    }
    return blackCount / (canvas.width * canvas.height);
  };

  // When scratch reaches 70%, mark unlocked (but don't clear mask automatically).
  useEffect(() => {
    const threshold = 0.7;
    const completion = checkScratchCompletion();
    console.log('Scratch completion percentage:', completion);
    if (!unlocked && completion >= threshold) {
      setUnlocked(true);
      // Now show the unlock button.
    }
  }, [paths, unlocked]);

  // Mouse event handlers.
  const handleMouseDown = (e) => {
    if (unlocked) return;
    setIsScratching(true);
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const handleMouseMove = (e) => {
    if (!isScratching) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (y < 0 || y > rect.height || x < 0 || x > rect.width) return;
    setCurrentPath((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = async () => {
    if (!isScratching) return;
    setIsScratching(false);
    if (currentPath.length > 0) {
      const newPath = { id: uuidv4(), points: currentPath };
      setPaths((prev) => [...prev, newPath]);
      setCurrentPath([]);
      try {
        const response = await axios.post(
          `http://localhost:9090/api/countries/${countryName}/scratch`,
          newPath,
          getAuthHeaders(),
        );
        console.log('Scratch path saved:', response.data);
      } catch (error) {
        toast.error(`Failed to save scratch path: ${error.response?.data?.error || error.message}`);
        console.error('Error saving scratch path:', error);
      }
    }
  };

  const generatePathString = (points) => {
    if (points.length < 2) return '';
    return points.map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`)).join(' ');
  };

  // Unlock button click handler.
  const handleUnlockClick = async () => {
    console.log('Unlocking country with name:', countryName);
    if (!authenticated) {
      alert('You must sign in to unlock countries!');
      return;
    }
    try {
      const unlockResponse = await axios.post(
        `http://localhost:9090/api/countries/${countryName}/unlock`,
        {},
        getAuthHeaders(),
      );
      console.log('Country unlocked response:', unlockResponse.data);

      setMaskCleared(true);
      useStore.setState((state) => ({
        authSlice: {
          ...state.authSlice,
          user: {
            ...state.authSlice.user,
            unlockedCountries: unlockResponse.data.unlockedCountries,
          },
        },
      }));
      window.dispatchEvent(new CustomEvent('unlockStateChanged', { detail: { unlockMaskCleared: true } }));
      navigate(`/country/${countryId}`, { state: { unlockMaskCleared: true } });
    } catch (error) {
      if (
        error.response
        && error.response.data
        && error.response.data.error
        && error.response.data.error.includes('already unlocked')
      ) {
        console.log('Country is already unlocked.');
        setMaskCleared(true);
        window.dispatchEvent(new CustomEvent('unlockStateChanged', { detail: { unlockMaskCleared: true } }));
        navigate(`/country/${countryId}`, { state: { unlockMaskCleared: true } });
      } else {
        toast.error(`Failed to unlock country: ${error.response?.data?.error || error.message}`);
        console.error('Unlock error:', error);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <svg
        ref={svgRef}
        width="768"
        height="768"
        viewBox="0 0 768 768"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
        style={{ pointerEvents: 'auto' }}
      >
        <defs>
          <mask id="scratchMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {paths.map((path) => (
              <path
                key={path.id}
                d={generatePathString(path.points)}
                stroke="black"
                strokeWidth="100"
                strokeLinecap="round"
                fill="none"
              />
            ))}
            {currentPath.length > 0 && (
              <path
                d={generatePathString(currentPath)}
                stroke="black"
                strokeWidth="100"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </mask>
        </defs>
        {/* Render mask only if not cleared */}
        {!maskCleared && (
          <image
            href={Scratch}
            x="0"
            y="0"
            width="768"
            height="768"
            mask="url(#scratchMask)"
            preserveAspectRatio="xMidYMid slice"
          />
        )}
      </svg>
      {/* Show unlock button if unlocked (70% reached) but mask not cleared */}
      {unlocked && !maskCleared && (
        <button className="unlock-btn"
          type="button"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px 20px',
            fontSize: '18px',
            zIndex: 2,
          }}
          onClick={handleUnlockClick}
        >
          Unlock
        </button>
      )}
    </div>
  );
}

export default CountryScratchOff;
