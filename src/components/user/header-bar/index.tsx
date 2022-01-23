import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';
import { DASHBOARD } from 'helper/url-list';

import Button from 'component/button';
import UserAvatar from 'component/user/avatar';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';

import { acc } from 'adapter/api/acc';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle
}

export const UserHeaderBar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t, i18n } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const { data } = acc.useGetAccWhoAmIQuery(undefined);
    const [postAccLogout] = acc.usePostAccLogoutMutation();

    const onLogout = () => {
        void postAccLogout({})
            .then(() => {
                dispatch(acc.util.resetApiState());
                dispatch(mainRequest.util.resetApiState());
                history.push('/login');
            });
    };

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
                    <Dropdown
                        render={({ onClose }) => (
                            <DropdownMenu>
                                <DropdownMenuItem
                                    selected={false}
                                    onClick={() => {
                                        onClose();

                                        history.push(DASHBOARD);
                                    }}
                                >
                                    {t('components.user.header-bar.dropdown.dashboard')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    selected={false}
                                    onClick={() => {
                                        onClose();
                                        onLogout();
                                    }}
                                >
                                    {t('components.user.header-bar.dropdown.logout')}
                                </DropdownMenuItem>
                            </DropdownMenu>
                        )}
                    >
                        <UserAvatar
                            title={`${data.first_name || ''} ${data.last_name || ''}`.trim()}
                            className={cn('user-header-bar__avatar')}
                            avatar={{ src: data.photo, preset: 'small' }}
                        />
                    </Dropdown>
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
