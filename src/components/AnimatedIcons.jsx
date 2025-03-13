import React from 'react';
import { motion } from 'framer-motion';
import plane from '../images/paper-airplane.png';
import popSound from './sounds/pop.mp3';

// Animation for staggering child elements
const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

// Animation for individual icons
const item = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

function AnimatedIcons({
  thoughts, funFactCoords, unlockMaskCleared, getFunFactSVG, onIconClick,
}) {
  const allIcons = [
    ...thoughts.map((thought) => ({ ...thought, type: 'thought' })),
    ...funFactCoords.map((fact) => ({ ...fact, type: 'funFact' })),
  ];

  return (
    <motion.div
      className="animated-icons-container"
      style={{
        position: 'absolute', top: 0, left: 0, width: '768px', height: '768px',
      }}
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Render icons only when unlockMaskCleared is true */}
      {unlockMaskCleared && allIcons.map((icon) => (
        <motion.div
          key={icon._id || icon.category}
          data-id={icon._id || icon.category}
          role="button"
          tabIndex="0"
          style={{
            position: 'absolute',
            top: icon.yCoordinate,
            left: icon.xCoordinate,
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            cursor: 'pointer',
          }}
          variants={item}
          onAnimationComplete={() => {
            // Play pop sound when animation completes
            const audio = new Audio(popSound);
            audio.play();
          }}
          onClick={() => onIconClick && onIconClick(icon)}
        >
          {icon.type === 'thought' ? (
            <img
              src={plane}
              alt="Paper Airplane Icon"
              width="50"
              height="50"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            getFunFactSVG(icon.category)
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default AnimatedIcons;
