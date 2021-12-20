import React, { useMemo, Suspense, Fragment } from 'react';
import { Router, Route, Redirect, Switch, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { parse, stringify } from 'query-string';
import { createBrowserHistory } from 'history';

import { baseRoutes, IProps } from './config';
import { acc } from 'adapter/api/acc';

const history = createBrowserHistory();

export const Routes = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { data } = acc.useGetAccWhoAmIQuery({});
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const elRoutes = (routes: Array<IProps>) => {
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
                if(!isPublic && !data?.id) {
                    return (
                        <Route
                            key={index}
                            {...props}
                            render={(attrs) => {
                                const newQueryString = stringify({
                                    ...qs,
                                    from: attrs.location.pathname
                                });

                                return <Redirect to={`/login?${newQueryString}`} />;
                            }}
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
    };

    const elHelmet = useMemo(() => (
        <Helmet
            htmlAttributes={{
                lang: i18n.language
            }}
            title={t('helmet.title.main')}
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
