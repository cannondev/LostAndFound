// store/auth-slice.js

import axios from 'axios';

const ROOT_URL = 'http://localhost:9090/api';

export default function createAuthSlice(set, get) {
  return {
    authSlice: {
      authenticated: false,
      user: { homeCountry: null, fullName: null },
    },

    loadUser: () => {
      const token = localStorage.getItem('token');
      if (token) {
        set({ authenticated: true });
      } else {
        set({ authenticated: false });
      }

      const homeCountry = localStorage.getItem('homeCountry');
      if (homeCountry) {
        set((state) => ({
          authSlice: { ...state.authSlice, user: { ...state.authSlice.user, homeCountry } },
        }));
      }
    },

    setUserHomeCountry: (country) => {
      localStorage.setItem('homeCountry', country);
      set((state) => ({
        authSlice: {
          ...state.authSlice,
          user: { ...state.authSlice.user, homeCountry: country },
        },
      }));
    },

    signinUser: async (fields) => {
      try {
        console.log('Sending sign-in request:', fields);
        const response = await axios.post(`${ROOT_URL}/signin`, fields);
        console.log('Signin Response:', response);

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
        }
        return false;
      } catch (error) {
        console.error('Sign In Failed', error);
        return false;
      }
    },

    signUpUser: async (fields) => {
      try {
        console.log('Sending signup request:', fields);

        const response = await axios.post(`${ROOT_URL}/signup`, fields);
        console.log('Signup Response:', response);

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
        }
        return false;
      } catch (error) {
        console.error('Sign Up Failed', error);
        console.error('Signup Failed:', error.response ? error.response.data : error.message);
        return false;
      }
    },

    signoutUser: (navigate) => {
      console.log('Logging out...');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('homeCountry');
      localStorage.removeItem('fullname');

      set((state) => ({
        authSlice: {
          ...state.authSlice,
          authenticated: false,
          user: null,
        },
      }));

      console.log('Storage after logout:', localStorage);
      navigate('/');
    },

  };
}
