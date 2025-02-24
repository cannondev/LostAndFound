import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WorldMap from 'react-svg-worldmap';
import CountryInfo from './CountryInfo';
import '../style.scss';
import NewThought from './newThought';
// import newThought from '../components/newThought';

function Home() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  // Handle search bar change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleNavigation = () => {
    navigate('/thoughts/new');
  };

  // Fetch country data from a local JSON file located in the public folder
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Build an absolute URL using PUBLIC_URL
        const response = await fetch(`${process.env.PUBLIC_URL}/countries_data.json`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        // Read response as text and then parse as JSON
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

  // Handle country click using the 'countryName' property from your data
  const handleCountryClick = (countryData) => {
    if (countryData && countryData.countryName) {
      navigate(`/country/${countryData.countryName}`);
    } else {
      console.error('Country data is missing or malformed:', countryData);
    }
  };

  // Filter countries based on the search query using the countryName field
  const filteredCountries = data.filter((country) => country.countryName
    && country.countryName.toLowerCase().includes(query.toLowerCase()));

  // Create highlighted countries array for the world map
  const highlightedCountries = filteredCountries.map((country) => ({
    country: country.countryName,
    value: 1, // This value is used by the map for coloring
  }));

  return (
    <div className="App">
      {/* User Settings Menu */}
      <div className="settings-container">
        <button className="settings-button" type="button" onClick={() => setSettingsOpen(!settingsOpen)}>
          ⚙️
        </button>
        {settingsOpen && (
          <div className="settings-menu">
            <p onClick={() => alert('Profile clicked!')}>Profile</p>
            <p onClick={() => alert('Settings clicked!')}>Settings</p>
            <p onClick={() => alert('Logging out...')}>Logout</p>
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

      {/* World Map */}
      <WorldMap
        blankColor="#ffffff"
        size="xxl"
        data={highlightedCountries}
        onClickFunction={handleCountryClick}
      />

      {/* Buttons at the bottom */}
      <div className="button-container">
        <button className="custom-button" onClick={handleNavigation} type="button">
          Create Thought
        </button>
        <button className="custom-button" type="button">Button 2</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thoughts/new" element={<NewThought />} />
      <Route path="/country/:country" element={<CountryInfo />} />
    </Routes>
  );
}

export default App;
