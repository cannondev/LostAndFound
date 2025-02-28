/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WorldMapComponent from './WorldMap';
import '../style.scss';
import NewThought from './newThought';
import Passport from './Passport';
import CountryDetail from './CountryDetail';

function Home() {
  const [query, setQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleThoughtNavigation = () => {
    navigate('/thoughts/new');
  };

  const handlePassportNavigation = () => {
    navigate('/passport');
  };

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
            <p onClick={() => console.log('Logging out...')}>Logout</p>
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

      <WorldMapComponent />

      <div className="button-container">
        <button className="custom-button" onClick={handleThoughtNavigation} type="button">
          Create Thought
        </button>
        <button className="custom-button" onClick={handlePassportNavigation} type="button">
          Open Passport
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thoughts/new" element={<NewThought />} />
      <Route path="/country/:countryId" element={<CountryDetail />} />
      <Route path="/passport" element={<Passport />} />
    </Routes>
  );
}

export default App;
