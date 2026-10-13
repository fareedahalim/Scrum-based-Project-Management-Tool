import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    profileImage: string | null;
}

interface AuthState {
    user: User | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        }
    }

})

export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;