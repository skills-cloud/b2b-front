import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

const NotFound = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    return (
        <div className={cn('not-found')}>
            <Helmet
                title={t('helmet.title.not-found')}
                meta={[{
                    name   : 'document-state',
                    content: 'static'
                }]}
            />

            <h1 className={cn('not-found__header')}>
                {t('routes.not-found.header')}
            </h1>
            <div className={cn('not-found__desc')}>
                {t('routes.not-found.desc')}
            </div>
        </div>
    );
};

export default NotFound;
