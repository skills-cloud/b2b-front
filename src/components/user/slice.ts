import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { sync, authGoogle } from './actions-old';

export interface IState {
    image?: string,
    login?: string,
    name?: string
}

const initialState: IState = {};

export const slice = createSlice({
    name        : 'user',
    initialState: initialState,
    reducers    : {
        set(state, action: PayloadAction<Partial<IState>>) {
            return {
                ...state,
                ...action.payload
            };
        },
        reset() {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sync.fulfilled, (state, action) => {
                return {
                    ...state,
                    ...action.payload
                };
            })
            .addCase(sync.rejected, () => {
                return initialState;
            });
    }
});

export const name = slice.name;

export const reducer = slice.reducer;

export const actions = {
    ...slice.actions,
    sync,
    authGoogle
};

export default reducer;
