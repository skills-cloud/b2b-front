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
