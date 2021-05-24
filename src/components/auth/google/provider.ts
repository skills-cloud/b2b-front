import { useEffect, Fragment, ReactNode, createElement } from 'react';

import { useDispatch } from 'component/core/store';
import { actions } from 'component/user/slice';

import config from 'config';

export interface IProps {
    children?: ReactNode
}

export const AuthGoogleProvider = (props: IProps) => {
    const dispatch = useDispatch();

    useEffect(() => {
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
                                const basicProfile = authInstance.currentUser.get().getBasicProfile();

                                // @TODO: ----------
                                fetch('http://dev.b2bcloud.com:19000/auth', {
                                    method: 'POST',
                                    mode  : 'no-cors',
                                    cache : 'no-cache',
                                    body  : JSON.stringify({
                                        token: authInstance.currentUser.get().getAuthResponse().id_token
                                    }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                    .catch(console.error);

                                dispatch(
                                    actions.set({
                                        id        : basicProfile.getId(),
                                        email     : basicProfile.getEmail(),
                                        name      : basicProfile.getName(),
                                        familyName: basicProfile.getFamilyName(),
                                        givenName : basicProfile.getGivenName(),
                                        photo     : basicProfile.getImageUrl()
                                    })
                                );
                            }
                        })
                        .catch(console.error);
                });
            })
            .catch(console.error);
    }, []);

    return createElement(Fragment, {
        children: props.children
    });
};

export default AuthGoogleProvider;
