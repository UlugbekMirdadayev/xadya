import { configureStore } from '@reduxjs/toolkit';
import localeOrders from './localeOrders';

export const store = configureStore({
  reducer: {
    localeOrders
  }
});
