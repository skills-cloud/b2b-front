import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { IUserData, postAccLogout } from 'adapter/api/acc';

export const set = createAction<Partial<IUserData>>(
    '@@user/SET'
);

export const reset = createAction(
    '@@user/RESET'
);

export const logout = createAsyncThunk('@@user/logout', async (payload, { rejectWithValue }) => {
    try {
        await postAccLogout();
    } catch(error) {
        return rejectWithValue(error);
    }
});
