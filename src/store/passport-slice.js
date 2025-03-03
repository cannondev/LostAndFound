import axios from 'axios';
// import { toast } from 'react-toastify';

export default function PassportSlice(set, get) {
  const ROOT_URL = 'http://localhost:9090/api/countries/unlocked';

  // NEED TO FETCH UNLOCKED COUNTRIES BY USERID? This will require a change to country routing.
  // For now I am ignoring user distinction
  return {
    countriesVisited: [], // stores all fetched unlocked countries
    fetchAllUnlockedCountries: async () => {
      try {
        const token = localStorage.getItem('token');
        const userID = get().authSlice.user?.id; // Get userID from Zustand store

        if (!userID) {
          console.error('No user ID found. Ensure the user is logged in.');
          return;
        }

        const response = await axios.get(`${ROOT_URL}/${userID}`, {
          headers: { authorization: token },
        });

        set((state) => ({
          passportSlice: {
            ...state.passportSlice,
            countriesVisited: response.data.unlockedCountries,
          },
        }));

        console.log('Fetched countries for user:', userID, response.data.unlockedCountries);
      } catch (error) {
        console.error('Failed to fetch unlocked countries:', error);
      }
    },

  };
}
