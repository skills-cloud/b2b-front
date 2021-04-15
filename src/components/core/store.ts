import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { useSelector as useSelectorRedux, useDispatch as useDispatchRedux, TypedUseSelectorHook } from 'react-redux';

import userReducer, { name as userReducerName } from 'component/user/slice';

import config from 'config';

const middleware = getDefaultMiddleware();

if(__DEVELOPMENT__) {
    middleware.push(createLogger(config['redux-logger'] || {}));
}

const store = configureStore({
    devTools: false,
    reducer : {
        [userReducerName]: userReducer
    },
    middleware
});

export type TStore = ReturnType<typeof store.getState>;
export type TDispatch = typeof store.dispatch;

export const useDispatch = <TCustomDispatch = TDispatch>() => useDispatchRedux<TCustomDispatch>();
export const useSelector = useSelectorRedux as TypedUseSelectorHook<TStore>;

export default store;
