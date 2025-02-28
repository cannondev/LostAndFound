// store/auth-slice.js

import axios from 'axios';

const ROOT_URL = 'http://localhost:9090/api';

export default function createAuthSlice(set, get) {
  return {
    authenticated: false,
    loadUser: () => {
      const token = localStorage.getItem('token');
      if (token) {
        set({ authenticated: true });
      } else {
        set({ authenticated: false });
      }
    },

    signinUser: async (fields) => {
      try {
        console.log('Sending sign-in request with:', fields);
        const response = await axios.post(`${ROOT_URL}/signin`, fields);
        console.log('Received response:', response.data);
        if (response.data.token) {
          set({ authenticated: true });
          localStorage.setItem('token', response.data.token);
          return true;
        } else {
          console.error('No token received from API');
          return false;
        }
      } catch (error) {
        console.error('Sign In Failed', error);
        return false;
      }
    },
    signUpUser: async (fields) => {
      try {
        const response = await axios.post(`${ROOT_URL}/signup`, fields);

        if (response.data.token) {
          set({ authenticated: true });
          localStorage.setItem('token', response.data.token);
          return true;
        } else {
          console.error('No token received from API');
          return false;
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            alert('This email is already in use or invalid data. Please try another email.');
          } else {
            alert(`Sign Up Failed: ${error.response.data.message}` || 'An error occurred.');
          }
        } else {
          alert('Sign Up Failed: Unable to connect to server.');
        }
        console.error('Sign Up Failed', error);
        return false;
      }
    },

    signoutUser: (navigate) => {
      localStorage.removeItem('token');
      set({ authenticated: false });
      navigate('/');
    },
  };
}
