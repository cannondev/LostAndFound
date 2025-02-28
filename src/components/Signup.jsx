import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [homeCountry, setHomeCountry] = useState('');

  const navigate = useNavigate();
  const signUpUser = useStore(({ authSlice }) => authSlice.signUpUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signUpUser({ email: username, password, homeCountry });
    if (success) navigate('/');
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
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
        <input
          type="text"
          placeholder="homeCountry"
          value={homeCountry}
          onChange={(e) => setHomeCountry(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
