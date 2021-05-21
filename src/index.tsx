import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'component/core/store';
import AuthGoogleProvider from 'component/auth/google/provider';

import 'locale';

import Routes from 'route/index';

render(
    (
        <Provider store={store}>
            <AuthGoogleProvider>
                <Routes />
            </AuthGoogleProvider>
        </Provider>
    ),
    document.getElementById('app'),
    () => {
        console.info('App version: %s', __VERSION__);
    }
);
