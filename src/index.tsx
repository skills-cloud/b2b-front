import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'component/core/store';
import 'locale';

import Routes from 'route/index';

render(
    (
        <Provider store={store}>
            <Routes />
        </Provider>
    ),
    document.getElementById('app'),
    () => {
        console.info('App version: %s', __VERSION__);
    }
);
