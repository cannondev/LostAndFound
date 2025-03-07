import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';
import showToast from '../utils/toastUtils';
import countryNameToISO from '../utils/countryNameToISO'; // Import the country validation utility

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCountry, setHomeCountry] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const signUpUser = useStore(({ authSlice }) => authSlice.signUpUser);
  const setUserHomeCountry = useStore(({ authSlice }) => authSlice.setUserHomeCountry);

  const countrySynonyms = {
    usa: 'United States',
    us: 'United States',
    america: 'United States',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedCountry = countrySynonyms[homeCountry.trim().toLowerCase()] || homeCountry.trim();
    const isoCode = countryNameToISO(normalizedCountry);

    if (!isoCode) {
      showToast('Country is invalid', 'error');
      return;
    }

    const finalCountry = normalizedCountry === 'United States' ? 'United States' : normalizedCountry;
    setUserHomeCountry(finalCountry);

    const success = await signUpUser({
      email,
      password,
      homeCountry: finalCountry,
      fullName,
    });

    if (success) {
      navigate('/home');
    } else {
      showToast('Email is already in use', 'error');
    }
  };
  const handleSignInNavigation = () => {
    navigate('/signin');
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="FullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="homeCountry"
          value={homeCountry}
          onChange={(e) => setHomeCountry(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      <button className="custom-button" onClick={handleSignInNavigation} type="button">
        SignIn
      </button>
    </div>
  );
}

export default SignUp;
