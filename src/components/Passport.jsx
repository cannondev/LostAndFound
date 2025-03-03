import React, { useState, useEffect } from 'react';
import useStore from '../store';
import '../style.scss';

function PassportModal({ isOpen, onClose }) {
  const [activePage, setActivePage] = useState('profile'); // Tracks which page is active
  const countriesVisited = useStore((state) => state.passportSlice.countriesVisited);
  const fetchAllUnlockedCountries = useStore((state) => state.passportSlice.fetchAllUnlockedCountries);

  useEffect(() => {
    if (isOpen) {
      fetchAllUnlockedCountries();
    }
  }, [isOpen, fetchAllUnlockedCountries]);

  if (!isOpen) return null;

  return (
    <div className="passport-modal-overlay">
      <div className="passport-modal">
        <button className="close-button" type="button" onClick={onClose}>X</button>

        <div className="passport-header">
          <button onClick={() => setActivePage('profile')} type="button" className={activePage === 'profile' ? 'active' : ''}>Profile</button>
          <button onClick={() => setActivePage('details')} type="button" className={activePage === 'details' ? 'active' : ''}>Country Details</button>
        </div>

        <div className="passport-content">
          {activePage === 'profile' && (
            <div className="profile-page">
              <h2>My Passport</h2>
              <ul>
                {countriesVisited.length > 0 ? (
                  countriesVisited.map((country) => <li key={country}>{country}</li>)
                ) : (
                  <li>Keep exploring to discover more countries!</li>
                )}
              </ul>
            </div>
          )}

          {activePage === 'details' && (
            <div className="country-details-page">
              <h2>Country Details</h2>
              <p>Select a country to view its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PassportModal;
