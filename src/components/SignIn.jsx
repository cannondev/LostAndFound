import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const signinUser = useStore(({ authSlice }) => authSlice.signinUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signing in with:', username, password);
    try {
      const success = await signinUser({ email: username, password });
      console.log('Sign-in success:', success);
      if (success) {
        console.log('Navigating to home...');
        navigate('/');
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
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
    </div>
  );
}

export default SignIn;
