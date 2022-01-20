import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';
import SystemUserForm from 'route/system-users/form';

export const SystemUsersCreate = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    return (
        <div className={cn('system-users-create')}>
            <main className={cn('system-users-create__main')}>
                <h2
                    className={cn('system-users-create__main-header')}
                    children={t('routes.system-create.title')}
                />
                <SystemUserForm />
            </main>
        </div>
    );
};

export default SystemUsersCreate;
