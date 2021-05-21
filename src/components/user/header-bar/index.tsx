import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useClassnames, { IStyle } from 'hook/use-classnames';
import { useSelector, useDispatch } from 'component/core/store';
import Button from 'component/button';
import Avatar from 'component/avatar';

import { name as keyStore, actions } from './../slice';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle
}

export const UserHeaderBar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector((store) => store[keyStore]);

    const elButtonLogin = useMemo(() => {
        if(!user.id) {
            return (
                <Button
                    children={t('components.user.header-bar.buttons.login')}
                    onClick={(e) => {
                        e.preventDefault();

                        const authInstance = window.gapi.auth2.getAuthInstance();

                        if(!authInstance.isSignedIn.get()) {
                            authInstance.signIn({
                                fetch_basic_profile: true,
                                ux_mode            : 'redirect',
                                redirect_uri       : window.location.origin
                            })
                                .catch(console.error);
                        }
                    }}
                />
            );
        }
    }, [user.id, i18n.language]);

    const elButtonLogout = useMemo(() => {
        if(user.id) {
            return (
                <Button
                    isSecondary={true}
                    children={t('components.user.header-bar.buttons.logout')}
                    onClick={(e) => {
                        e.preventDefault();

                        const authInstance = window.gapi.auth2.getAuthInstance();

                        if(authInstance.isSignedIn.get()) {
                            authInstance.signOut();

                            dispatch(actions.reset());
                        }
                    }}
                />
            );
        }
    }, [user.id, i18n.language]);

    const elProfile = useMemo(() => {
        if(user.id) {
            let name = user.name;

            if(user.givenName && user.familyName) {
                name = `${user.givenName} ${user.familyName?.substring(0, 1)}.`;
            }

            return (
                <div className={cn('user-header-bar__profile')}>
                    <Avatar src={user.photo} preset="small" />
                    <Link to="/profile" className={cn('user-header-bar__profile-name')}>{name}</Link>
                </div>
            );
        }
    }, [user.id]);

    return (
        <div className={cn('user-header-bar')}>
            {elProfile}
            {elButtonLogin}
            {elButtonLogout}
        </div>
    );
};

export default UserHeaderBar;
