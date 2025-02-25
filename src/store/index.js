import { create } from 'zustand';
import thoughtSlice from './thought-slice';

const useStore = create((set, get) => ({
  thoughtSlice: thoughtSlice(set, get),
}));

export default useStore;
