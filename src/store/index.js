import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import thoughtSlice from './thought-slice';
import passportSlice from './passport-slice';

const useStore = create(devtools((set, get) => ({
  thoughtSlice: thoughtSlice(set, get),
  passportSlice: passportSlice(set, get),
})));

export default useStore;
