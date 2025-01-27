import { createSlice } from '@reduxjs/toolkit';

const ticketSlice = createSlice({
  name: 'tickets',
  initialState: {
    list: [], // Array to store books
  },
  reducers: {
    setTickets: (state, action) => {
      state.list = action.payload;
    },
    selectTickets: (state) => {
        return state.list;
    },
    disableTicket:(state,action) =>{
      state.list = state.list.filter(item => item._id != action.payload);
    }
  },
});

export const { setTickets, selectTickets, disableTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
