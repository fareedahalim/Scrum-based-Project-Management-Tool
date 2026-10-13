import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from './slice/tokenSlice';
import authReducer from './slice/authSlice'

export const  store = configureStore({
    reducer: {
        token: tokenReducer,
        auth: authReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;