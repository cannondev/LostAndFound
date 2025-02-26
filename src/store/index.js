import { create } from 'zustand';
import thoughtSlice from './thought-slice';
import passportSlice from './passport-slice';

const useStore = create((set, get) => ({
  thoughtSlice: thoughtSlice(set, get),
  passportSlice: passportSlice(set, get),
}));

export default useStore;
