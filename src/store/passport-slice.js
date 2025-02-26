import axios from 'axios';
import { toast } from 'react-toastify';

export default function PassportSlice(set, get) {
  const ROOT_URL = 'http://localhost:9090/api/countries/unlocked/all';

  // NEED TO FETCH UNLOCKED COUNTRIES BY USERID? This will require a change to country routing.
  // For now I am ignoring user distinction
  return {
    countriesVisited: [], // stores all fetched unlocked countries
    fetchAllUnlockedCountries: async () => {
      try {
        const response = await axios.get(ROOT_URL);
        set(({ passportSlice }) => { passportSlice.countriesVisited = response.data; }, false, 'passport/fetchAllUnlockedCountries');
      } catch (error) {
        toast.error(`Failed to fetch unlocked countries: ${error.message}`);
      }
    },
  };
}
