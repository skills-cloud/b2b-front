import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import UserAvatar from 'component/user/avatar';

import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle
}

export const UserHeaderBar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const { data } = acc.useGetAccWhoAmIQuery({});

    const elButtonLogin = useMemo(() => {
        if(!data?.id) {
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
    }, [data?.id, i18n.language]);

    const elProfile = useMemo(() => {
        if(data?.id) {
            return (
                <div className={cn('user-header-bar__profile')}>
                    <UserAvatar
                        title={`${data.first_name || ''} ${data.last_name || ''}`.trim()}
                        titleTo="/"
                        className={cn('user-header-bar__avatar')}
                        avatar={{ src: data.photo, preset: 'small' }}
                    />
                </div>
            );
        }
    }, [data?.id, data?.photo, data?.first_name, data?.last_name]);

    return (
        <div className={cn('user-header-bar')}>
            {elProfile}
            {elButtonLogin}
        </div>
    );
};

export default UserHeaderBar;
