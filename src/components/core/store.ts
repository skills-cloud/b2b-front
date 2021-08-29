import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import { useSelector as useSelectorRedux, useDispatch as useDispatchRedux, TypedUseSelectorHook } from 'react-redux';

import userReducer, { key as keyUser } from 'component/user/reducer';
import { cv } from 'adapter/api/cv';
import { contact } from 'adapter/api/contact';
import { acc } from 'adapter/api/acc';
import { dictionary } from 'adapter/api/dictionary';
import { career } from 'adapter/api/career';
import { organization } from 'adapter/api/organization';
import { certificate } from 'adapter/api/certificate';
import { education } from 'adapter/api/education';
import { position } from 'adapter/api/position';
import { project } from 'adapter/api/project';
import { mainRequest } from 'src/adapters/api/main';

import config from 'config';

const middleware = getDefaultMiddleware().concat([
    cv.middleware,
    acc.middleware,
    contact.middleware,
    dictionary.middleware,
    career.middleware,
    organization.middleware,
    certificate.middleware,
    education.middleware,
    position.middleware,
    project.middleware,
    mainRequest.middleware
]);

if(__DEVELOPMENT__) {
    middleware.push(createLogger(config['redux-logger'] || {}));
}

const store = configureStore({
    devTools: false,
    reducer : {
        [keyUser]                 : userReducer,
        [cv.reducerPath]          : cv.reducer,
        [contact.reducerPath]     : contact.reducer,
        [acc.reducerPath]         : acc.reducer,
        [dictionary.reducerPath]  : dictionary.reducer,
        [career.reducerPath]      : career.reducer,
        [organization.reducerPath]: organization.reducer,
        [certificate.reducerPath] : certificate.reducer,
        [education.reducerPath]   : education.reducer,
        [position.reducerPath]    : position.reducer,
        [project.reducerPath]     : project.reducer,
        [mainRequest.reducerPath] : mainRequest.reducer
    },
    middleware
});

export type TStore = ReturnType<typeof store.getState>;
export type TDispatch = typeof store.dispatch;

export const useDispatch = <TCustomDispatch = TDispatch>() => useDispatchRedux<TCustomDispatch>();
export const useSelector = useSelectorRedux as TypedUseSelectorHook<TStore>;

export default store;
