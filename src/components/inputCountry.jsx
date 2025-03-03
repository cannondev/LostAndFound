import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function InputCountry() {
  const [homeCountry, setHomeCountry] = useState('');
  const navigate = useNavigate();
  const setUserHomeCountry = useStore((state) => state.authSlice.setUserHomeCountry);

  const handleSignUpNavigation = () => {
    navigate('/signup');
  };

  const handleSignInNavigation = () => {
    navigate('/signin');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (homeCountry) {
      setUserHomeCountry(homeCountry);
      navigate('/home');
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
          onChange={(e) => setHomeCountry(e.target.value)}
          required
        />
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
