import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import { useSelector } from 'component/core/store';
import Button from 'component/button';
import UserAvatar from 'component/user/avatar';

import { key as keyUser } from './../reducer';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle
}

export const UserHeaderBar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const user = useSelector((store) => store[keyUser]);

    const elButtonLogin = useMemo(() => {
        if(!user.id) {
            return (
                <Button
                    children={t('components.user.header-bar.buttons.login')}
                    onClick={(e) => {
                        e.preventDefault();

                        history.push('/login');
                    }}
                />
            );
        }
    }, [user.id, i18n.language]);

    const elProfile = useMemo(() => {
        if(user.id) {
            return (
                <div className={cn('user-header-bar__profile')}>
                    <UserAvatar
                        title={`${user.first_name || ''} ${user.last_name || ''}`.trim()}
                        titleTo="/"
                        className={cn('user-header-bar__avatar')}
                        avatar={{ src: user.photo, preset: 'small' }}
                    />
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
