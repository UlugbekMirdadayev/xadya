import { configureStore } from '@reduxjs/toolkit';
import localeOrders from './localeOrders';
import user from './user';


export const store = configureStore({
  reducer: {
    user,
    localeOrders
  }
});
