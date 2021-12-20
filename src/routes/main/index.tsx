import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import useClassnames from 'hook/use-classnames';

import Typography from 'component/typography';
import Button from 'component/button';
import { useDispatch } from 'component/core/store';

import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';

export const Main = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const [postAccLogout] = acc.usePostAccLogoutMutation();

    const onLogout = () => {
        void postAccLogout({})
            .then(() => {
                dispatch(acc.util.resetApiState());
                history.push('/login');
            });
    };

    const elLogout = useMemo(() => {
        return (
            <Button onClick={onLogout}>
                Logout
            </Button>
        );
    }, []);

    return (
        <div className={cn('main')}>
            <Typography type="h1">
                {t('routes.main.hello')}
            </Typography>
            {elLogout}
        </div>
    );
};

export default Main;
