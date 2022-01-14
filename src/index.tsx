import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from 'component/core/store';
import { acc } from 'src/adapters/api/acc';
import Loader from 'component/loader';

import Routes from 'route/index';
import 'locale';

store.dispatch(acc.endpoints.getAccWhoAmI.initiate({}))
    .finally(() => {
        render((
            <Suspense fallback={<Loader />}>
                <Provider store={store}>
                    <Routes />
                </Provider>
            </Suspense>
        ),
        document.getElementById('app'),
        () => {
            console.info('App version: %s', __VERSION__);
        });
    });