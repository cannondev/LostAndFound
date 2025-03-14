/* Utilized styling from https://codepen.io/_ItsJonQ/pen/jOVwoJ and edited for our purposes */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Loading.css';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const CLOUDS = [
  {
    id: 1,
    className: 'cloud big front slowest',
    width: 762,
    height: 331,
    path: `M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
      c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
      C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
      S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z`,
  },
  {
    id: 2,
    className: 'cloud distant smaller',
    width: 762,
    height: 331,
    path: `M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
      c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
      C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
      S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z`,
  },
  {
    id: 3,
    className: 'cloud small slow',
    width: 762,
    height: 331,
    path: `M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
      c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
      C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
      S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z`,
  },
  {
    id: 4,
    className: 'cloud distant super-slow massive',
    width: 762,
    height: 331,
    path: `M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
      c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
      C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
      S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z`,
  },
  {
    id: 5,
    className: 'cloud slower',
    width: 762,
    height: 331,
    path: `M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
      c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
      C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
      S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z`,
  },
];

function Loading() {
  const [cloudTops] = useState(() => CLOUDS.map(() => randomBetween(5, 60)));

  return (
    <div className="loading-page">
      <motion.h1
        className="title"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{
          duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror',
        }}
      >
        Lost &amp; Found
      </motion.h1>

      <div className="plane-wrapper">
        <div className="plane-container">
          {/* Clicking the plane -> navigates to home page ("/") */}
          <Link to="/input-Country">
            <svg
              version="1.1"
              x="0px"
              y="0px"
              width="1131.53px"
              height="379.304px"
              viewBox="0 0 1131.53 379.304"
              xmlSpace="preserve"
              className="plane"
            >
              <polygon
                fill="#D8D8D8"
                points="72.008,0 274.113,140.173 274.113,301.804 390.796,221.102 601.682,367.302 1131.53,0.223"
              />
              <polygon
                fill="#C4C4C3"
                points="1131.53,0.223 274.113,140.173 274.113,301.804 390.796,221.102"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Clouds */}
      <div className="clouds">
        {CLOUDS.map((cloud, index) => (
          <svg
            key={cloud.id}
            version="1.1"
            x="0px"
            y="0px"
            width={`${cloud.width}px`}
            height={`${cloud.height}px`}
            viewBox={`0 0 ${cloud.width} ${cloud.height}`}
            xmlSpace="preserve"
            className={cloud.className}
            style={{ top: `${cloudTops[index]}%` }}
          >
            <path fill="#FFFFFF" d={cloud.path} />
          </svg>
        ))}
      </div>

      <motion.p
        className="bottom-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
      >
        Are you ready to get lost and found?
      </motion.p>
    </div>
  );
}

export default Loading;
