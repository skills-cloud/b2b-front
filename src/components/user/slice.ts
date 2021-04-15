import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IState {
    id?: number,
    name?: string,
    photo?: string
}

const initialState: IState = {
    id   : 1,
    name : 'Марк Б.',
    photo: ''
};

export const { actions, reducer, name } = createSlice({
    name        : 'user',
    initialState: initialState,
    reducers    : {
        set(state, action: PayloadAction<Partial<IState>>) {
            return {
                ...state,
                ...action.payload
            };
        }
    }
});

export default reducer;
