import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useClassnames, { IStyle } from 'hook/use-classnames';
import { useSelector } from 'component/core/store';
import Button from 'component/button';
import Avatar from 'component/avatar';
import history from 'component/core/history';

import { key as keyUser } from './../reducer';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle
}

export const UserHeaderBar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t, i18n } = useTranslation();
    const user = useSelector((store) => store[keyUser]);

    const elButtonLogin = useMemo(() => {
        if(!user.id) {
            return (
                <Button
                    children={t('components.user.header-bar.buttons.login')}
                    onClick={(e) => {
                        e.preventDefault();

                        history.push('/login');

                        // const authInstance = window.gapi.auth2.getAuthInstance();
                        //
                        // if(!authInstance.isSignedIn.get()) {
                        //     authInstance.signIn({
                        //         fetch_basic_profile: true,
                        //         ux_mode            : 'redirect',
                        //         redirect_uri       : window.location.origin
                        //     })
                        //         .catch(console.error);
                        // }
                    }}
                />
            );
        }
    }, [user.id, i18n.language]);

    const elProfile = useMemo(() => {
        if(user.id) {
            return (
                <div className={cn('user-header-bar__profile')}>
                    <Avatar src={user.photo} preset="small" />
                    <Link to="/profile" className={cn('user-header-bar__profile-name')}>{`${user.first_name} ${user.last_name}`}</Link>
                </div>
            );
        }
    }, [user.id, user.photo, user.first_name, user.last_name]);

    return (
        <div className={cn('user-header-bar')}>
            {elProfile}
            {elButtonLogin}
        </div>
    );
};

export default UserHeaderBar;
