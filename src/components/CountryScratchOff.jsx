import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import { getName } from 'country-list';
import axios from 'axios';
import { toast } from 'react-toastify';

// Add helper function for auth headers
const getAuthHeaders = () => ({
  headers: { authorization: localStorage.getItem('token') },
});

function CountryScratchOff() {
  // Use useLocation to extract the countryId from the URL.
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const countryId = pathParts[2];
  const countryName = getName(countryId) || countryId;

  const [paths, setPaths] = useState([]); // Completed scratch strokes
  const [currentPath, setCurrentPath] = useState([]); // Stroke being drawn
  const [isScratching, setIsScratching] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const svgRef = useRef(null);
  const canvasRef = useRef(null);

  // Create an offscreen canvas for computing scratch progress.
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 768;
    canvasRef.current = canvas;
  }, []);

  // Load scratch data from the backend when the component mounts.
  useEffect(() => {
    axios.get(`http://localhost:9090/api/countries/${countryName}/scratch`, getAuthHeaders())
      .then((response) => {
        if (response.data && response.data.paths) {
          setPaths(response.data.paths);
        }
      })
      .catch((error) => console.error('Error fetching scratch data:', error));
  }, [countryName]);

  // Function to calculate scratch progress using the offscreen canvas.
  const checkScratchCompletion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');

    // Fill with white.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each scratch stroke in black.
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

    // Count nearly black pixels.
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    let blackCount = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 10 && data[i + 1] < 10 && data[i + 2] < 10) {
        blackCount++;
      }
    }
    const totalPixels = canvas.width * canvas.height;
    return blackCount / totalPixels;
  };

  // Check scratch progress on paths update.
  useEffect(() => {
    const threshold = 0.7; // 70% scratched
    const completion = checkScratchCompletion();
    console.log('Scratch completion percentage:', completion);

    if (!unlocked && completion >= threshold) {
      setUnlocked(true);

      const unlockCountry = async () => {
        try {
          const response = await axios.post(
            `http://localhost:9090/api/countries/${countryName}/unlock`,
            {},
            getAuthHeaders(),
          );
          console.log('Country unlocked:', response.data);
        } catch (error) {
          toast.error(`Failed to unlock country: ${error.response?.data?.error || error.message}`);
          console.error('Unlock error:', error);
        }
      };

      unlockCountry();
    }
  }, [paths, unlocked, countryName]);

  const handleMouseDown = (e) => {
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
    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const handleMouseUp = async () => {
    setIsScratching(false);
    if (currentPath.length > 0) {
      const newPath = { id: uuidv4(), points: currentPath };

      // Update state for immediate UI responsiveness.
      setPaths((prevPaths) => [...prevPaths, newPath]);
      setCurrentPath([]);

      try {
        // Save the new scratch stroke to the backend using axios
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
    return points
      .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
      .join(' ');
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
        pointerEvents: 'none',
        zIndex: 1,
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
                strokeWidth="50"
                strokeLinecap="round"
                fill="none"
              />
            ))}
            {currentPath.length > 0 && (
              <path
                d={generatePathString(currentPath)}
                stroke="black"
                strokeWidth="50"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="768"
          height="768"
          fill="red"
          mask="url(#scratchMask)"
        />
      </svg>
    </div>
  );
}

export default CountryScratchOff;
