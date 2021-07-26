import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'component/core/store';

import 'locale';

import Routes from 'route/index';
import { getAccWhoAmI } from 'adapter/api/acc';

const requestAuth = getAccWhoAmI();

import { set as setUser } from 'component/user/actions';

store
    .dispatch(async () => {
        try {
            const payload = await requestAuth;

            store.dispatch(setUser(payload));
        } catch(err) {
            console.error(err);
        }
    })
    .finally(() => {
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
    });

