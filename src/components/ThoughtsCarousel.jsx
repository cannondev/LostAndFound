import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ROOT_URL = 'https://project-api-lost-and-found-9lyg.onrender.com/api';

function ThoughtsCarousel({ countryDetails }) {
  const countryName = countryDetails?.countryName;

  const [thoughtsWithUser, setThoughtsWithUser] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch thoughts from the dedicated endpoint
  useEffect(() => {
    async function fetchThoughts() {
      try {
        const response = await axios.get(
          `${ROOT_URL}/countries/${countryName}/thoughts`,
          { headers: { authorization: localStorage.getItem('token') } },
        );
        console.log('Fetched thoughts:', response.data);
        return response.data; // Expecting an array of thought objects
      } catch (error) {
        console.error('Error fetching thoughts:', error);
        return [];
      }
    }

    async function fetchThoughtsWithUser() {
      const thoughts = await fetchThoughts();
      const updatedThoughts = await Promise.all(
        thoughts.map(async (thought) => {
          try {
            // Always fetch complete user info for each thought.
            const userResponse = await axios.get(
              `${ROOT_URL}/users/${thought.user}/info`,
              { headers: { authorization: localStorage.getItem('token') } },
            );
            return { ...thought, user: userResponse.data.user };
          } catch (error) {
            console.error(`Error fetching user info for thought ${thought._id}:`, error);
            return thought;
          }
        }),
      );
      console.log('Updated thoughts with user data:', updatedThoughts);
      setThoughtsWithUser(updatedThoughts);
    }
    fetchThoughtsWithUser();
  }, [countryName]);

  // Format each thought string to include content, fullName, and homeCountry.
  const formattedThoughts = thoughtsWithUser.length > 0
    ? thoughtsWithUser.map((thought) => {
      const userFullName = thought.user?.fullName || 'Unknown User';
      const userHomeCountry = thought.user?.homeCountry || 'Unknown Country';
      return `${thought.content}\n\n${userFullName}, ${userHomeCountry}`;
    })
    : ['No thoughts found.'];

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? formattedThoughts.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === formattedThoughts.length - 1 ? 0 : prevIndex + 1));
  };

  // Debug: log the formatted thoughts when they update.
  useEffect(() => {
    console.log('Formatted Thoughts:', formattedThoughts);
  }, [formattedThoughts]);

  return (
    <div className="thoughts-carousel">
      <div className="carousel-container">
        <button type="button" className="arrow left-arrow" onClick={prevSlide}>
          &#9664;
        </button>
        <div className="carousel-slide">
          <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {formattedThoughts[currentIndex]}
          </p>
        </div>
        <button type="button" className="arrow right-arrow" onClick={nextSlide}>
          &#9654;
        </button>
      </div>
    </div>
  );
}

export default ThoughtsCarousel;
