import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function DisplayPassport() {
  // Retrieve the list of countries and the fetching action from your store
  const countriesVisited = useStore((state) => state.passportSlice.countriesVisited);
  const fetchAllUnlockedCountries = useStore((state) => state.passportSlice.fetchAllUnlockedCountries);
  const navigate = useNavigate();

  // Fetch countries when the component mounts
  useEffect(() => {
    fetchAllUnlockedCountries();
  }, [fetchAllUnlockedCountries]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="passportContainer">
      <h1>My Passport</h1>
      <ul>
        {countriesVisited && countriesVisited.length > 0 ? (
          countriesVisited.map((country) => (
            <li key={country}>{country}</li>
          ))
        ) : (
          <li>Keep exploring to discover more countries!</li>
        )}
      </ul>
      <button className="close" type="button" onClick={handleClose}>
        Close
      </button>
    </div>
  );
}

export default DisplayPassport;
