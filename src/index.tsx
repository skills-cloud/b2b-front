import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'component/core/store';

import Routes from 'route/index';
import 'locale';

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

