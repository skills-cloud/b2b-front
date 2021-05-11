import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPencil from 'component/icons/pencil';
import IconApproved from 'component/icons/approved';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Rate = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    return (
        <div id={props.id} className={cn('rate')}>
            <div className={cn('')}>
                <h1 className={cn('rate__header')}>{t('routes.person.rate.header')}</h1>
                <div className={cn('rate__controls')}>
                    <div className={cn('rate__control', 'rate__control_disable')}>
                        <IconPencil />
                    </div>
                </div>
            </div>
            <div className={cn('rate__content')}>
                <div className={cn('rate__block')}>
                    <h3 className={cn('rate__block-title')}>{t('routes.person.rate.remote.title')}</h3>
                    <p className={cn('rate__block-text')}>
                        <span className={cn('rate__block-text-span')}>{t('routes.person.rate.remote.hour')}</span>
                        <span className={cn('rate__block-text-span')}>$15</span>
                    </p>
                    <p className={cn('rate__block-text')}>
                        <span className={cn('rate__block-text-span')}>{t('routes.person.rate.remote.day')}</span>
                        <span className={cn('rate__block-text-span')}>$200</span>
                    </p>
                    <p className={cn('rate__block-text')}>
                        <span className={cn('rate__block-text-span')}>{t('routes.person.rate.remote.month')}</span>
                        <span className={cn('rate__block-text-span')}>$3000</span>
                    </p>
                </div>
                <div className={cn('rate__block')}>
                    <h3 className={cn('rate__block-title')}>{t('routes.person.rate.office.title')}</h3>
                    <p className={cn('rate__block-text')}>
                        <span className={cn('rate__block-text-span')}>{t('routes.person.rate.office.hour')}</span>
                        <span className={cn('rate__block-text-span')}>$15</span>
                    </p>
                    <p className={cn('rate__block-text')}>
                        <span className={cn('rate__block-text-span')}>{t('routes.person.rate.office.day')}</span>
                        <span className={cn('rate__block-text-span')}>$200</span>
                    </p>
                    <p className={cn('rate__block-text')}>
                        <span className={cn('rate__block-text-span')}>{t('routes.person.rate.office.month')}</span>
                        <span className={cn('rate__block-text-span')}>$3000</span>
                    </p>
                </div>
                <div className={cn('rate__block', 'rate__block_control')}>
                    <IconApproved />
                </div>
            </div>
        </div>
    );
};

export default Rate;
