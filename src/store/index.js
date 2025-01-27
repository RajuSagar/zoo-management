import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import ticketSlice from "./reducers/ticketSlice";

const store = configureStore({
    reducer:{
        user: authSlice,
        tickets: ticketSlice
    },
})

export default store;