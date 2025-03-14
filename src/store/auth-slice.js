// store/auth-slice.js

import axios from 'axios';

const ROOT_URL = 'https://project-api-lost-and-found-9lyg.onrender.com/api';

export default function createAuthSlice(set, get) {
  return {
    authSlice: {
      authenticated: false,
      user: { homeCountry: null, fullName: null, unlockedCountries: ['United States of America'] },
    },

    loadUser: () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const homeCountry = localStorage.getItem('homeCountry');

      if (token && user) {
        const parsedUser = JSON.parse(user);

        const unlockedCountries = Array.isArray(parsedUser.unlockedCountries)
          ? parsedUser.unlockedCountries
          : ['United States of America'];

        set((state) => ({
          authSlice: {
            ...state.authSlice,
            authenticated: true,
            user: {
              ...parsedUser,
              unlockedCountries,
              homeCountry: homeCountry || JSON.parse(user).homeCountry,
            },
          },
        }));
      } else {
        set((state) => ({
          authSlice: {
            ...state.authSlice,
            authenticated: false,
            user: { homeCountry: homeCountry || null },
          },
        }));
      }
    },

    setUnlockedCountries: (countries) => {
      set((state) => ({
        authSlice: {
          ...state.authSlice,
          user: { ...state.authSlice.user, unlockedCountries: countries },
        },
      }));
      localStorage.setItem('user', JSON.stringify({ ...get().authSlice.user, unlockedCountries: countries }));
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
