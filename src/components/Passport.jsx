import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from '../store';
import '../style.scss';
import FunFactsCarousel from './FunFactsCarousel';
import ThoughtsCarousel from './ThoughtsCarousel';

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
        {/* <div className="my-passport-header">
          <h2>My Passport</h2>
        </div> */}
        <div className="passport-body">
          {activeView === 'profile' ? (
            <div className="opening-page">
              <div className="profile-page">

                {/* Left Page */}
                <div className="profile-left-page">
                  <h1 className="page-header">PROFILE</h1>
                  <div className="left-page-content">
                    <div className="profile-detail">
                      <div className="profile-label">EMAIL</div>
                      <div className="profile-answer">{user?.email || 'Not provided'}</div>
                      <hr className="divider" />
                    </div>
                    <div className="profile-detail">
                      <div className="profile-label">HOME COUNTRY</div>
                      <div className="profile-answer">{user?.homeCountry || 'Not set'}</div>
                      <hr className="divider" />
                    </div>
                    <div className="profile-detail">
                      <div className="profile-label">COUNTRIES VISITED</div>
                      <div className="profile-answer">{countriesVisited.length}</div>
                      <hr className="divider" />
                    </div>
                  </div>

                </div>

                {/* Right Page */}
                <div className="profile-right-page">
                  <h1 className="page-header">UNLOCKED COUNTRIES</h1>
                  <div className="countries-unlocked-list">
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
                </div>
              </div>
              <div className="footer-button">
                <button className="goBackButton" type="button" onClick={onClose}>
                  Return to World Map
                </button>
              </div>
            </div>
          ) : (
            <div className="opening-page">
              <div className="profile-page">
                {countryDetails ? (
                  <>
                    {/* Left Page */}
                    <div className="profile-left-page">

                      <div className="left-header">
                        <h1 className="country-header">{countryDetails.countryName}</h1>
                      </div>

                      <div className="fun-facts-section">
                        <h3>Fun Facts</h3>
                        <FunFactsCarousel countryDetails={countryDetails} />
                      </div>
                      {/*
                      <div className="flag-container">
                        <img
                          className="country-flag"
                          src={countryDetails.flagUrl || '/default-flag.png'}
                          alt={`${countryDetails.countryName} Flag`}
                        />
                      </div> */}

                    </div>

                    {/* Right Page */}
                    <div className="profile-right-page">

                      <div className="right-description">
                        <p className="country-description">
                          {countryDetails.description || 'No description available.'}
                        </p>
                      </div>

                      <div className="thoughts-section">
                        <h3>Thoughts Found in {countryDetails.countryName}</h3>
                        <ThoughtsCarousel countryDetails={countryDetails} />
                      </div>

                    </div>
                  </>
                ) : (
                  <p>Loading country details...</p>
                )}

              </div>
              <div className="footer-button">
                <button className="goBackButton" onClick={onBackButtonClick} type="button" style={{ marginBottom: '10px' }}>
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PassportModal;
