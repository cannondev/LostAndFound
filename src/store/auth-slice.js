// store/auth-slice.js

import axios from 'axios';

const ROOT_URL = 'http://localhost:9090/api';

export default function createAuthSlice(set, get) {
  return {
    authSlice: {
      authenticated: false,
      user: null,
    },

    loadUser: () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      set((state) => ({
        authSlice: {
          ...state.authSlice,
          authenticated: !!token,
          user: user ? JSON.parse(user) : null,
        },
      }));
    },

    setUserHomeCountry: (country) => {
      set((state) => ({
        authSlice: {
          ...state.authSlice,
          user: { ...state.authSlice.user, homeCountry: country },
        },
      }));
    },

    signinUser: async (fields) => {
      try {
        console.log('Sending sign-in request with:', fields);
        const response = await axios.post(`${ROOT_URL}/signin`, fields);
        console.log('Received response:', response.data);

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));

          set((state) => ({
            authSlice: {
              ...state.authSlice,
              authenticated: true,
              user: response.data,
            },
          }));

          console.log('Stored token in localStorage:', localStorage.getItem('token'));
          console.log('Updated Zustand state:', get().authSlice);

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
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
          set((state) => ({
            authSlice: {
              ...state.authSlice,
              authenticated: true,
              user: response.data,
            },
          }));
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
      localStorage.removeItem('user');
      set((state) => ({
        authSlice: {
          authenticated: false,
          user: null,
        },
      }));
      navigate('/');
    },
  };
}
