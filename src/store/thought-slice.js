import axios from 'axios';
import { toast } from 'react-toastify';

export default function createThoughtSlice(set, get) {
  const ROOT_URL = 'http://localhost:9090/api/thought';

  return {
    all: [], // Stores all fetched thoughts
    current: {}, // Stores a single thought

    // Fetch a single thought by ID
    fetchThought: async (id) => {
      try {
        const response = await axios.get(`${ROOT_URL}/${id}`);
        set(({ thoughtSlice }) => { thoughtSlice.current = response.data; }, false, 'thought/fetchThought');
      } catch (error) {
        toast.error(`Failed to fetch thought: ${error.message}`);
      }
    },

    // Create a new thought
    createThought: async (thought) => {
      try {
        const response = await axios.post(ROOT_URL, thought);
        set(({ thoughtSlice }) => { thoughtSlice.all = [...thoughtSlice.all, response.data]; }, false, 'thought/createThought');
      } catch (error) {
        toast.error(`Failed to create thought: ${error.message}`);
      }
    },
  };
}
