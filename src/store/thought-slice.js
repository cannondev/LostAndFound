import axios from 'axios';
import { toast } from 'react-toastify';

export default function createThoughtSlice(set, get) {
  const ROOT_URL = 'http://localhost:9090/api/thought';

  const getAuthHeaders = () => ({
    headers: { authorization: localStorage.getItem('token') },
  });

  return {
    all: [], // Stores all fetched thoughts
    userThoughts: [],
    current: {}, // Stores a single thought
    fetchAllThoughts: async () => {
      try {
        const response = await axios.get(ROOT_URL);
        set(({ thoughtSlice }) => { thoughtSlice.all = response.data; }, false, 'thought/fetchAllThoughts');
      } catch (error) {
        toast.error(`Failed to fetch thoughts: ${error.message}`);
      }
    },

    // Fetch a single thought by ID
    fetchThought: async (id) => {
      try {
        const response = await axios.get(`${ROOT_URL}/${id}`);
        set(({ thoughtSlice }) => { thoughtSlice.current = response.data; }, false, 'thought/fetchThought');
      } catch (error) {
        toast.error(`Failed to fetch thought: ${error.message}`);
      }
    },

    fetchUserThoughts: async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/my-thoughts`, getAuthHeaders());
        set(({ thoughtSlice }) => { thoughtSlice.userThoughts = response.data; }, false, 'thought/fetchUserThoughts');
      } catch (error) {
        toast.error(`Failed to fetch your thoughts: ${error.response?.data?.error || error.message}`);
      }
    },

    // Create a new thought
    createThought: async (thought) => {
      try {
        const response = await axios.post(ROOT_URL, thought, getAuthHeaders());
        set(({ thoughtSlice }) => { thoughtSlice.all = [...thoughtSlice.all, response.data.thought]; }, false, 'thought/createThought');
      } catch (error) {
        toast.error(`Failed to create thought: ${error.message}`);
      }
    },
  };
}
