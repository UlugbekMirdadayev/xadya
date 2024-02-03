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
    },
    removeLocaleOrder: (state, { payload }) => {
      const thisRoom = state?.find((st) => st?.room === payload?.room);
      if (thisRoom) {
        return state
          ?.map((st) => {
            const orders = st?.recs
              ?.map((rec) => {
                if (rec.name === payload?.name) {
                  if (rec.count - 1) {
                    return { ...rec, count: rec.count - 1 };
                  } else {
                    return false;
                  }
                }
                return rec;
              })
              .filter(Boolean);

            if (orders?.length) {
              return {
                ...st,
                recs: orders
              };
            } else {
              return null;
            }
          })
          .filter(Boolean);
      }
      return state.filter((st) => st.room !== payload.room);
    }
  }
});

export const { addLocaleOrder, removeLocaleOrder } = localeOrdersSlice.actions;

export default localeOrdersSlice.reducer;
