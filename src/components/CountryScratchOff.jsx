import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

function CountryScratchOff() {
  const [paths, setPaths] = useState([]); // Stores all completed paths
  const [currentPath, setCurrentPath] = useState([]); // Store the points of the path being drawn
  const [isScratching, setIsScratching] = useState(false);
  const svgRef = useRef(null);

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

  const handleMouseUp = () => {
    setIsScratching(false);
    if (currentPath.length > 0) {
      const newPath = { id: uuidv4(), points: currentPath };
      setPaths((prevPaths) => [...prevPaths, newPath]);
      setCurrentPath([]);
    }
  };

  const generatePathString = (points) => {
    if (points.length < 2) return '';
    return points.map((point, index) => {
      const { x, y } = point;
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
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
        zIndex: 10,
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
        style={{
          pointerEvents: 'auto',
        }}
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
