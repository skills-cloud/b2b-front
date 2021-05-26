import { useEffect, Fragment, ReactNode, createElement } from 'react';

import { useDispatch, useSelector } from 'component/core/store';
import { actions, name } from 'component/user/slice';

import config from 'config';

export interface IProps {
    children?: ReactNode
}

export const AuthGoogleProvider = (props: IProps) => {
    const dispatch = useDispatch();
    const isAuth = useSelector((store) => store[name].login);

    useEffect(() => {
        if(!isAuth) {
            // @ts-ignore
            import(/* webpackIgnore: true */ 'https://apis.google.com/js/api.js')
                .then(() => {
                    window.gapi.load('client:auth2', () => {
                        window.gapi.client
                            .init({
                                clientId: config.google.api['client-id'],
                                scope   : config.google.api.scope
                            })
                            .then(() => {
                                const authInstance = window.gapi.auth2.getAuthInstance();

                                if(authInstance.isSignedIn.get()) {
                                    const idToken = authInstance.currentUser.get().getAuthResponse().id_token;

                                    void dispatch(actions.authGoogle(idToken));
                                }
                            })
                            .catch(console.error);
                    });
                })
                .catch(console.error);
        }
    }, []);

    return createElement(Fragment, {
        children: props.children
    });
};

export default AuthGoogleProvider;
