import React, { useCallback, useMemo, Suspense, Fragment } from 'react';
import { Router, Route, Redirect, Switch, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'component/core/store';
import history from 'component/core/history';
import { name as userReducerName } from 'component/user/slice';

import { baseRoutes, IProps } from './config';

export const Routes = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const isAuth = useSelector((store) => !!store[userReducerName].id);

    const elRoutes = useCallback((routes: Array<IProps>) => {
        if(Array.isArray(routes)) {
            return routes.map((
                {
                    layout   : Layout,
                    component: Component,
                    isPublic,
                    ...props
                },
                index
            ) => {
                if(!isPublic && !isAuth) {
                    return (
                        <Route
                            key={index}
                            render={() => (
                                <Redirect to="/login" />
                            )}
                        />
                    );
                }

                if(Layout && Component) {
                    return (
                        <Route
                            key={index}
                            {...props}
                            render={(attrs) => (
                                <Layout>
                                    <Component {...attrs} />
                                </Layout>
                            )}
                        />
                    );
                }

                return (
                    <Route
                        key={index}
                        {...props}
                        render={(attrs) => {
                            if(Component) {
                                return <Component {...attrs} />;
                            }
                        }}
                    />
                );
            });
        }
    }, [isAuth]);

    const elHelmet = useMemo(() => (
        <Helmet
            htmlAttributes={{
                lang: i18n.language
            }}
            title={t('helmet.title')}
            link={[{
                rel : 'canonical',
                href: window.location.href
            }]}
            meta={[{
                name   : 'description',
                content: t('helmet.description')
            }, {
                name   : 'keywords',
                content: t('helmet.keywords')
            }, {
                name   : 'document-state',
                content: 'dynamic'
            }, {
                name   : 'robots',
                content: 'all'
            }]}
        />
    ), [i18n.language, window.location.href]);

    return (
        <Fragment>
            {elHelmet}
            <Switch location={location}>
                {elRoutes(baseRoutes)}
                <Redirect to="/404" from="*" />
            </Switch>
        </Fragment>
    );
};

export default () => (
    <Router history={history}>
        <Suspense fallback={<div>Loader here...</div>}>
            <Routes />
        </Suspense>
    </Router>
);
