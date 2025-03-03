/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WorldMapComponent from './WorldMap';
import '../style.scss';
import NewThought from './newThought';
import PassportModal from './Passport';
import CountryDetail from './CountryDetail';
import useStore from '../store';
import SignIn from './SignIn';
import SignUp from './Signup';
import InputCountry from './inputCountry';

// import newThought from '../components/newThought';

function Home() {
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const loadUser = useStore(({ authSlice }) => authSlice.loadUser);
  const [data, setData] = useState([]);
  const authenticated = useStore(({ authSlice }) => authSlice.authenticated);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  // const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);

  // const authenticated = useStore(({ authSlice }) => authSlice.authenticated);
  useEffect(() => {
    loadUser();
  }, []);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleThoughtNavigation = () => {
    navigate('/thoughts/new');
  };

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

  // Fetch country data from a local JSON file located in the public folder
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/countries_data.json`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        try {
          const countryData = JSON.parse(text);
          setData(countryData);
        } catch (parseError) {
          console.error('Failed to parse JSON. Response text:', text);
          throw parseError;
        }
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchCountries();
  }, []);

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
      <div className="settings-container">
        <button className="settings-button" type="button" onClick={() => setSettingsOpen(!settingsOpen)}>
          ⚙️
        </button>
        {settingsOpen && (
          <div className="settings-menu">
            <p onClick={() => console.log('Profile clicked!')}>Profile</p>
            <p onClick={() => console.log('Settings clicked!')}>Settings</p>
            <p onClick={() => navigate('/input-country')}>Logout</p>
          </div>
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
        <button className="custom-button" onClick={handleThoughtNavigation} type="button">
          Create Thought
        </button>
        <button className="custom-button" onClick={handlePassportOpen} type="button">
          Open Passport
        </button>
        <PassportModal isOpen={isPassportOpen} on onClose={handlePassportClose} />
      </div>
      <div>
        {!authenticated && (
        <>
          <button className="custom-button" onClick={handleSignInNavigation} type="button">
            SignIn
          </button>
          <button className="custom-button" onClick={handleSignUpNavigation} type="button">
            SignUp
          </button>
        </>
        )}
      </div>
      {/* Show authentication status */}
      <div className="auth-status">
        {authenticated ? <p>You are logged in ✅</p> : <p>You are not logged in ❌</p>}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/input-country" element={<InputCountry />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Home />} />
      <Route path="/thoughts/new" element={<NewThought />} />
      <Route path="/country/:countryId" element={<CountryDetail />} />
      <Route path="/Passport" element={<PassportModal />} />
    </Routes>
  );
}

export default App;
