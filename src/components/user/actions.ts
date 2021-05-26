import { createAsyncThunk } from '@reduxjs/toolkit';

import { user, auth } from 'adapter/api';

export const sync = createAsyncThunk('user/sync', async () => {
    const payload = await user.user();

    return payload;
});

export const authGoogle = createAsyncThunk<void, string>('user/auth/google', async (idToken, thunkAPI) => {
    await auth.authGoogle(idToken);
    await thunkAPI.dispatch(sync());
});

export default {
    sync,
    authGoogle
};
