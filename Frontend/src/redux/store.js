import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Features/authSlice.js';
import productReducer from './Features/productSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product : productReducer
  },
});

export default store;