// store/auth-slice.js

import axios from 'axios';

const ROOT_URL = 'http://localhost:9090/api';

export default function createAuthSlice(set, get) {
  return {
    authSlice: {
      authenticated: false,
      user: { homeCountry: null },
    },

    // loadUser: () => {
    //   const token = localStorage.getItem('token');
    //   const user = localStorage.getItem('user');
    //   set((state) => ({
    //     authSlice: {
    //       ...state.authSlice,
    //       authenticated: !!token,
    //       user: user ? JSON.parse(user) : null,
    //     },
    //   }));
    // },
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
        const response = await axios.post(`${ROOT_URL}/signin`, fields);

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
        const response = await axios.post(`${ROOT_URL}/signup`, fields);

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));

          set({ authenticated: true });
          return true;
        }
        return false;
      } catch (error) {
        console.error('Sign Up Failed', error);
        return false;
      }
    },

    signoutUser: (navigate) => {
      console.log('Logging out...');

      // Explicitly remove ALL relevant localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('homeCountry');

      set((state) => ({
        authSlice: {
          ...state.authSlice,
          authenticated: false,
          user: null, // Reset user completely
        },
      }));

      console.log('Storage after logout:', localStorage); // Debugging check
      navigate('/input-country'); // Redirect to home
    },

  };
}
