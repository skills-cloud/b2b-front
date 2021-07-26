import { createReducer } from '@reduxjs/toolkit';

import { set, reset, logout } from './actions';
import { IUserData } from 'adapter/api/acc';

export const key = 'user' as const;

export default createReducer<Partial<IUserData>>({}, (builder) => {
    builder
        // Set
        .addCase(
            set,
            (
                store,
                {
                    payload
                }
            ) => ({
                ...store,
                ...payload
            })
        )

        // Reset
        .addCase(
            reset,
            () => ({})
        )

        .addCase(
            logout.fulfilled,
            () => ({})
        );
});
