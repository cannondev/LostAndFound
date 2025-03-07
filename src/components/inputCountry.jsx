import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import countryNameToISO from '../utils/countryNameToISO';
import showToast from '../utils/toastUtils';

function InputCountry() {
  const [homeCountry, setHomeCountry] = useState('');
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();
  const setUserHomeCountry = useStore((state) => state.authSlice.setUserHomeCountry);

  const countrySynonyms = {
    usa: 'United States',
    us: 'United States',
    america: 'United States',
  };

  const handleSignUpNavigation = () => {
    navigate('/signup');
  };

  const handleSignInNavigation = () => {
    navigate('/signin');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedCountry = countrySynonyms[homeCountry.trim().toLowerCase()] || homeCountry.trim();

    const isoCode = countryNameToISO(normalizedCountry);

    if (isoCode) {
      setUserHomeCountry(normalizedCountry);
      navigate('/home');
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Enter Your Home Country</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Home Country"
          value={homeCountry}
          onChange={(e) => {
            setHomeCountry(e.target.value);
            setIsValid(true);
          }}
          required
        />
        {!isValid && showToast('Country is invalid', 'error')}
        <button type="submit">Continue</button>
      </form>
      <button className="custom-button" onClick={handleSignInNavigation} type="button">
        SignIn
      </button>
      <button className="custom-button" onClick={handleSignUpNavigation} type="button">
        SignUp
      </button>
    </div>
  );
}

export default InputCountry;
