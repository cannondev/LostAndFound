import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import '../style.scss';

function PassportModal({ isOpen, onClose }) {
  // Toggle the active view: "profile" for the list, "countryDetail" for details
  const [activeView, setActiveView] = useState('profile');
  // Store details for the selected country
  const [countryDetails, setCountryDetails] = useState(null);

  // Retrieve visited countries and user info from the store
  const countriesVisited = useStore((state) => state.passportSlice.countriesVisited);
  const fetchAllUnlockedCountries = useStore((state) => state.passportSlice.fetchAllUnlockedCountries);
  const user = useStore((state) => state.authSlice.user);

  // Helper to include the auth token in API requests
  const getAuthHeaders = () => ({
    headers: { authorization: localStorage.getItem('token') },
  });

  // When modal opens, fetch visited countries and reset to profile view
  useEffect(() => {
    if (isOpen) {
      fetchAllUnlockedCountries();
      setActiveView('profile');
    }
  }, [isOpen, fetchAllUnlockedCountries]);

  // Function to fetch country details from the backend
  const fetchCountryDetail = async (country) => {
    try {
      const res = await axios.get(
        `http://localhost:9090/api/countries/${country}`,
        getAuthHeaders(),
      );
      setCountryDetails(res.data.country);
    } catch (err) {
      console.error('Error fetching country details:', err.response?.data?.error || err.message);
      // Optionally, you can set a default fallback value or display a simple error message here.
      setCountryDetails(null);
    }
  };

  // Traditional event handler for clicking a country in the list
  const onCountryClick = (e) => {
    const country = e.currentTarget.getAttribute('data-country');
    setActiveView('countryDetail');
    fetchCountryDetail(country);
  };

  // Event handler for the "Back to Passport" button
  const onBackButtonClick = () => {
    setActiveView('profile');
    setCountryDetails(null);
  };

  // Don't render the modal if it isn't open
  if (!isOpen) return null;

  return (
    <div className="passport-modal-wrapper">
      <div className="passport-modal">
        <button className="close-button" type="button" onClick={onClose}>
          X
        </button>

        {activeView === 'profile' ? (
          <div className="profile-page">
            <h2>My Passport</h2>
            <p>Email: {user?.email || 'Not provided'}</p>
            <p>Home Country: {user?.homeCountry || 'Not set'}</p>
            <p>Countries Visited: {countriesVisited.length}</p>
            <ul>
              {countriesVisited.length > 0 ? (
                countriesVisited.map((country) => (
                  <li
                    key={country}
                    data-country={country}
                    onClick={onCountryClick}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {country}
                  </li>
                ))
              ) : (
                <li>Keep exploring to discover more countries!</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="country-detail-page">
            <button onClick={onBackButtonClick} type="button" style={{ marginBottom: '10px' }}>
              ← Back to Passport
            </button>
            {countryDetails ? (
              <div>
                <h2>{countryDetails.countryName}</h2>
                <h3>Fun Fact</h3>
                {countryDetails.funFacts && countryDetails.funFacts.length > 0 ? (
                  <p>{countryDetails.funFacts[0]}</p>
                ) : (
                  <p>No fun facts available.</p>
                )}
                <p>
                  Date Explored:{' '}
                  {countryDetails.unlockDate
                    ? new Date(countryDetails.unlockDate).toLocaleDateString()
                    : 'N/A'}
                </p>
                <h3>Thoughts Found in {countryDetails.countryName}</h3>
                {countryDetails.thoughts && countryDetails.thoughts.length > 0 ? (
                  <ul>
                    {countryDetails.thoughts.map((thought) => (
                      <li key={thought._id}>{thought.content}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No thoughts found.</p>
                )}
                <div className="passport-badge">
                  <img
                    src={countryDetails.passportBadge || '/default-badge.png'}
                    alt="Passport Badge"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
              </div>
            ) : (
              <p>Error loading country details. Please try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PassportModal;
