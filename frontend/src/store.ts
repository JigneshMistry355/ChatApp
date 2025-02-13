import { configureStore } from "@reduxjs/toolkit";
import authSlice from './reducers';
import clientListSlice from '../src/features/ClientsList/clientListSlice.ts'

const store = configureStore({
    reducer: {
        auth: authSlice,
        clients: clientListSlice,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
