import { configureStore } from '@reduxjs/toolkit';
import materialsReducer from './materialsSlice';
import themeReducer from './themeSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    materials: materialsReducer,
    theme: themeReducer,
    auth: authReducer,
  },
});
