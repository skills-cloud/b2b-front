import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

export const Main = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    return (
        <div className={cn('main')}>
            {t('routes.main.hello')}
        </div>
    );
};

export default Main;
