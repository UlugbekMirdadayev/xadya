import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => payload
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
