import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const localeOrdersSlice = createSlice({
  name: 'localeOrders',
  initialState,
  reducers: {
    addLocaleOrder: (state, { payload }) => {
      const thisRoom = state.find((st) => st.room === payload.room);
      if (thisRoom) {
        return state.map((st) => {
          if (thisRoom.room === st.room) {
            const thisRecs = st.recs.find((st) => st.name === payload.name);
            if (thisRecs) {
              return {
                ...st,
                recs: st.recs.map((recs) => {
                  if (thisRecs.name === recs.name) {
                    return { ...recs, count: recs.count + 1 };
                  }
                  return recs;
                })
              };
            }
            return {
              ...st,
              recs: [...st.recs, { ...payload, count: 1 }]
            };
          }
          return st;
        });
      }
      return [
        ...state,
        {
          room: payload.room,
          recs: [{ ...payload, count: 1 }]
        }
      ];
    }
  }
});

export const { addLocaleOrder } = localeOrdersSlice.actions;

export default localeOrdersSlice.reducer;
