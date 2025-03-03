import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import '../style.scss';

function PassportModal({ isOpen, onClose }) {
  // Track the active view: "profile" for the passport list or "countryDetail" for the selected country details
  const [activeView, setActiveView] = useState('profile');
  // Store the details for the selected country
  const [countryDetails, setCountryDetails] = useState(null);
  // Manage loading and error states for API calls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve the visited countries and user info from our store
  const countriesVisited = useStore((state) => state.passportSlice.countriesVisited);
  const fetchAllUnlockedCountries = useStore((state) => state.passportSlice.fetchAllUnlockedCountries);
  const user = useStore((state) => state.authSlice.user);

  // Helper function to include the auth token in API requests
  const getAuthHeaders = () => ({
    headers: { authorization: localStorage.getItem('token') },
  });

  // When the modal opens, fetch the unlocked countries and reset to the profile view
  useEffect(() => {
    if (isOpen) {
      fetchAllUnlockedCountries();
      setActiveView('profile');
    }
  }, [isOpen, fetchAllUnlockedCountries]);

  // Function to fetch detailed information for a selected country from the backend
  const fetchCountryDetail = async (country) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:9090/api/countries/${country}`,
        getAuthHeaders(),
      );
      // Expect res.data.country to include: countryName, unlockDate, funFacts, thoughts, and passportBadge (if available)
      setCountryDetails(res.data.country);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Called when a user clicks on a country from the visited list
  const handleCountryClick = (country) => {
    setActiveView('countryDetail'); // Switch to the country detail view
    fetchCountryDetail(country); // Fetch details for the clicked country
  };

  // Return to the passport profile view from the country detail view
  const handleBackToProfile = () => {
    setActiveView('profile');
    setCountryDetails(null);
    setError(null);
  };

  // Do not render the modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="passport-modal-wrapper">
      <div className="passport-modal">
        {/* Modal close button */}
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
                    onClick={() => handleCountryClick(country)}
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
            {/* Button to return to the passport profile */}
            <button onClick={handleBackToProfile} type="button" style={{ marginBottom: '10px' }}>
              ← Back to Passport
            </button>
            {loading && <div>Loading country details...</div>}
            {error && <div>Error: {error}</div>}
            {countryDetails && (
              <div>
                <h2>{countryDetails.countryName}</h2>
                <h3>Fun Fact</h3>
                {countryDetails.funFacts && countryDetails.funFacts.length > 0 ? (
                  // Display the single fun fact
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PassportModal;
