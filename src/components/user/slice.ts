import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IState {
    id?: number | string,
    email?: string,
    name?: string,
    familyName?: string,
    givenName?: string,
    photo?: string
}

const initialState: IState = {};

export const { actions, reducer, name } = createSlice({
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
    }
});

export default reducer;
