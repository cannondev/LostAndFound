/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import WorldMapComponent from './WorldMap';
import '../style.scss';
import NewThought from './newThought';
import Passport from './Passport';
import CountryDetail from './CountryDetail';
import CountryScratchOff from './CountryScratchOff';
import useStore from '../store';
import SignIn from './SignIn';
import SignUp from './Signup';
import InputCountry from './inputCountry';
import Loading from './Loading';

// import newThought from '../components/newThought';

function Home() {
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const loadUser = useStore(({ authSlice }) => authSlice.loadUser);
  const [data] = useState([]);
  const authenticated = useStore(({ authSlice }) => authSlice.authenticated);
  const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);
  const [showPopup, setShowPopup] = useState(false);
  const signoutUser = useStore(({ authSlice }) => authSlice.signoutUser);

  // const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);

  // const authenticated = useStore(({ authSlice }) => authSlice.authenticated);
  useEffect(() => {
    setTimeout(() => {
      console.log('Running loadUser after delay...');
      loadUser();
    }, 500); // Wait 500ms to let signinUser complete
  }, []);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  // const handleThoughtNavigation = () => {
  //   navigate('/thoughts/new');
  // };

  const handlePassportNavigation = () => {
    navigate('/passport');
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

  const handleLogout = () => {
    signoutUser(navigate);
  };
  // Handle country click using the 'id' property from world-map-country-shapes
  const handleCountryClick = (countryData) => {
    if (countryData && countryData.countryCode) {
      navigate(`/country/${countryData.countryCode}`);
    } else {
      console.error('Country data is missing or malformed:', countryData);
    }
  };

  // Filter countries based on the search query using the countryName field
  const filteredCountries = data.filter((country) => country.countryName
    && country.countryName.toLowerCase().includes(query.toLowerCase()));

  // Create highlighted countries array for the world map
  const highlightedCountries = filteredCountries.map((country) => ({
    country: country.isoCode,
    value: 1, // This value is used by the map for coloring
  }));

  console.log('Authenticated:', authenticated);
  return (
    <div className="App">
      {/* User Settings Menu */}
      <h1>Welcome to Lost&Found</h1>

      {authenticated ? (
        <p>You are logged in ✅</p>
      ) : (
        <p>You are not logged in ❌</p>
      )}

      <p>Home Country: {homeCountry || 'Not set'}</p>
      <div className="settings-container">
        <button className="settings-button" type="button" onClick={() => setSettingsOpen(!settingsOpen)}>
          ⚙️
        </button>
        {settingsOpen && (
          <div className="settings-menu">
            <p onClick={() => console.log('Profile clicked!')}>Profile</p>
            <p onClick={() => console.log('Settings clicked!')}>Settings</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      <div>
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

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="search-bar"
        />
      </div>

      <WorldMapComponent onCountryClick={handleCountryClick} highlightedCountries={highlightedCountries} />

      <div className="button-container">
        <button className="custom-button" onClick={handlePopupToggle} type="button">
          Create Thought
        </button>
        <button className="custom-button" onClick={handlePassportNavigation} type="button">
          Open Passport
        </button>
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
        <Route path="/passport" element={<Passport />} />
      </Routes>
      {currentLocation?.pathname.startsWith('/country/') && (
        <CountryScratchOff />
      )}
    </>
  );
}

export default App;
