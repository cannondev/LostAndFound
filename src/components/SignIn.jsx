import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const signinUser = useStore(({ authSlice }) => authSlice.signinUser);

  const handleSignUpNavigation = () => {
    navigate('/signup');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signing in with:', email, password);
    try {
      const success = await signinUser({ email, password });
      console.log('Sign-in success:', success);
      if (success) {
        console.log('Navigating to home...');
        navigate('/home');
      } else {
        alert('Email or password is incorrect.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
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
        <button type="submit">Sign In</button>
      </form>
      <button className="custom-button" onClick={handleSignUpNavigation} type="button">
        SignUp
      </button>
    </div>
  );
}

export default SignIn;
