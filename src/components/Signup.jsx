import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [homeCountry, setHomeCountry] = useState('');

  const navigate = useNavigate();
  const signUpUser = useStore(({ authSlice }) => authSlice.signUpUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signUpUser({
      email, password, homeCountry,
    });
    if (success) navigate('/home');
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
