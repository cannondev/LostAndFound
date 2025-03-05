/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import WorldMapComponent from './WorldMap';
import '../style.scss';
import NewThought from './newThought';
import PassportModal from './Passport';
import CountryDetail from './CountryDetail';
import CountryScratchOff from './CountryScratchOff';
import useStore from '../store';
import SignIn from './SignIn';
import SignUp from './Signup';
import InputCountry from './inputCountry';
import Loading from './Loading';

// import newThought from '../components/newThought';

function Home() {
  // const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const loadUser = useStore(({ authSlice }) => authSlice.loadUser);
  // const [data] = useState([]);
  const authenticated = useStore(({ authSlice }) => authSlice.authenticated);
  const [isPassportOpen, setIsPassportOpen] = useState(false); // state for passport visibility
  const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);
  const [showPopup, setShowPopup] = useState(false);
  const signoutUser = useStore(({ authSlice }) => authSlice.signoutUser);

  // const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);

  // const authenticated  useStore(({ authSlice }) => authSlice.authenticated);
  useEffect(() => {
    document.querySelector('.world-map-container figure').style.backgroundColor = 'white';

    setTimeout(() => {
      console.log('Running loadUser after delay...');
      loadUser();
    }, 500); // Wait 500ms to let signinUser complete
  }, []);

  // const handleThoughtNavigation = () => {
  //   navigate('/thoughts/new');
  // };

  // toggle visiibility
  const handlePassportOpen = () => {
    setIsPassportOpen(true);
  };

  const handlePassportClose = () => {
    setIsPassportOpen(false);
  };

  const handleSignInNavigation = () => {
    navigate('/signin');
  };

  const handleSignUpNavigation = () => {
    navigate('/signup');
  };

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  // const handleLogout = () => {
  //   signoutUser(navigate);
  // };
  // Handle country click using the 'id' property from world-map-country-shapes
  const handleCountryClick = (countryData) => {
    if (countryData && countryData.countryCode) {
      navigate(`/country/${countryData.countryCode}`);
    } else {
      console.error('Country data is missing or malformed:', countryData);
    }
  };

  // // Filter countries based on the search query using the countryName field
  // const filteredCountries = data.filter((country) => country.countryName
  //   && country.countryName.toLowerCase().includes(query.toLowerCase()));

  // // Create highlighted countries array for the world map
  // const highlightedCountries = filteredCountries.map((country) => ({
  //   country: country.isoCode,
  //   value: 1, // This value is used by the map for coloring
  // }));

  console.log('Authenticated:', authenticated);
  return (
    <div className="overlay">
      <div className="App">
        <div className="top-bar">
          <button className="logout" onClick={() => signoutUser(navigate)}> X </button>
          {/* Auth Buttons */}
          <div className="auth">
            {!authenticated && (
            <>
              <button className="button" onClick={handleSignInNavigation} type="button">
                SignIn
              </button>
              <button className="button" onClick={handleSignUpNavigation} type="button">
                SignUp
              </button>
            </>
            )}
          </div>
        </div>

        {/* Info Section (Centered) */}
        <div className="info">
          <h1>Lost & Found</h1>
          {authenticated ? <p className="cta">Click a country to get started!</p> : <p>Signin to access all countries!</p>}
          <p>Home Country: {homeCountry || 'Not set'}</p>
        </div>

        <WorldMapComponent onCountryClick={handleCountryClick} />

        {/* <WorldMapComponent onCountryClick={handleCountryClick} highlightedCountries={highlightedCountries} /> */}

        <div className="button-container">
          <button className="custom-button" onClick={handlePopupToggle} type="button">
            Create Thought
          </button>
          <button className="custom-button" onClick={handlePassportOpen} type="button">
            Open Passport
          </button>
          <PassportModal isOpen={isPassportOpen} on onClose={handlePassportClose} />
        </div>
        {/* Show authentication status */}
        <div className="auth-status" />
        {/* Popup for new thought */}
        {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <NewThought closePopup={handlePopupToggle} />
          </div>
        </div>
        )}

      </div>
    </div>
  );
}

function App() {
  const currentLocation = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Loading />} />
        <Route path="/input-country" element={<InputCountry />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/thoughts/new" element={<NewThought />} />
        <Route path="/country/:countryId" element={<CountryDetail />} />
        <Route path="/Passport" element={<PassportModal />} />
      </Routes>
      {currentLocation?.pathname.startsWith('/country/') && (
        <CountryScratchOff />
      )}
    </>
  );
}

export default App;
