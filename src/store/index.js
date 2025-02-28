import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import thoughtSlice from './thought-slice';
import passportSlice from './passport-slice';
import createAuthSlice from './auth-slice';

const useStore = create(devtools((set, get) => ({
  authSlice: createAuthSlice(set, get),
  thoughtSlice: thoughtSlice(set, get),
  passportSlice: passportSlice(set, get),
  authType: 'token',
})));

export default useStore;
