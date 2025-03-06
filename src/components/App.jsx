/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import pass from '../images/pass.png';
import plane from '../images/plane.png';
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
  const loadUser = useStore((state) => state.authSlice?.loadUser);
  // const [data] = useState([]);
  const authenticated = useStore(({ authSlice }) => authSlice.authenticated);
  const [isPassportOpen, setIsPassportOpen] = useState(false); // state for passport visibility
  const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);
  const [showPopup, setShowPopup] = useState(false);
  const signoutUser = useStore(({ authSlice }) => authSlice.signoutUser);
  const user = useStore(({ authSlice }) => authSlice.user);

  // const homeCountry = useStore(({ authSlice }) => authSlice.user?.homeCountry);

  // const authenticated  useStore(({ authSlice }) => authSlice.authenticated);
  // document.querySelector('.world-map-container figure').style.background = '#fdf9ff';
  // document.querySelectorAll('.worldmap__figure-container path').forEach((path) => {
  //   path.style.strokeWidth = '1.5';
  //   path.style.cursor = 'pointer';
  // });
  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('Running loadUser after delay...');
  //     loadUser();
  //   }, 500);
  // }, []);
  // useEffect(() => {
  //   document.querySelector('.world-map-container figure').style.background = '#fdf9ff';
  //   console.log('Loading user on app start...');
  //   loadUser();
  // }, []);

  useEffect(() => {
    if (user && user.unlockedCountries) {
      console.log('unlocked', user.unlockedCountries);
    } else {
      console.log('User or unlockedCountries not found');
    }
    const mapContainer = document.querySelector('.world-map-container figure');
    if (mapContainer) {
      mapContainer.style.background = '#fdf9ff';
      mapContainer.style.transform = 'scale(2)';
      mapContainer.style.display = 'block';
    }
    loadUser();
  }, []);

  // useEffect(() => {
  //   if (authenticated) {
  //     console.log('User authenticated, reloading user data...');
  //     loadUser(); // Ensure user data is fetched again after login
  //   }
  // }, [authenticated]); // Reload user when authentication state changes

  // toggle visiibility
  const handlePassportOpen = () => {
    if (!authenticated) {
      alert('You must sign in to open the passport!');
      return;
    }
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
    if (!authenticated) {
      alert('You must sign in to send a thought!');
      return;
    }
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

  const unlockedCountries = user?.unlockedCountries || [];

  const highlightedCountries = unlockedCountries.map((countryCode) => ({
    country: countryCode,
    value: 1,
  }));

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
          {authenticated ? <p className="cta">Click a country to get started!</p> : <p>Sign in to access all countries!</p>}
          <p>Home Country: {homeCountry || 'Not set'}</p>
        </div>
        {/* <WorldMapComponent highlightedCountries={highlightedCountries} /> */}

        {/* <WorldMapComponent onCountryClick={handleCountryClick} /> */}

        <WorldMapComponent onCountryClick={handleCountryClick} highlightedCountries={highlightedCountries} />

        <div className="button-container">
          <button className="thought-button" onClick={handlePopupToggle} type="button">
            <img src={plane} className="icon" />
          </button>

          <button className="passport-button" onClick={handlePassportOpen} type="button">
            <img src={pass} className="icon" />
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
