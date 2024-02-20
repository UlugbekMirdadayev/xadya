import { createSlice } from '@reduxjs/toolkit';

const initialState = null;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      payload?.password && delete payload.password;
      return payload;
    }
  }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
