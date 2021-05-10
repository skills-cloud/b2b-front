import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import IconApproved from 'component/icons/approved';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Education = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    return (
        <div id={props.id} className={cn('education')}>
            <h1 className={cn('education__header')}>{t('routes.person.education.header')}</h1>
            <div className={cn('education__controls')}>
                <div className={cn('education__control', 'education__control_disable')}>
                    <IconPlus />
                </div>
                <div className={cn('education__control', 'education__control_disable')}>
                    <IconPencil />
                </div>
            </div>
            <div className={cn('education__collection')}>
                <div className={cn('education__education')}>
                    <strong className={cn('education__education-title')}>
                        ОГИМ, Кафедра менеджмента, ВУЗ
                        <IconApproved
                            svg={{
                                className: cn('education__icon')
                            }}
                        />
                    </strong>
                    <ul className={cn('education__list')}>
                        <li className={cn('education__list-item')}>
                            <strong>{t('routes.person.education.label.period')}</strong>
                            <span>15.01.2008 – 30.12.2013</span>
                        </li>
                        <li className={cn('education__list-item')}>
                            <strong>{t('routes.person.education.label.specialty')}</strong>
                            <span>Менеджер организации</span>
                        </li>
                        <li className={cn('education__list-item')}>
                            <strong>{t('routes.person.education.label.power')}</strong>
                            <span>Бакалавр</span>
                        </li>
                        <li className={cn('education__list-item')}>
                            <strong>{t('routes.person.education.label.diploma')}</strong>
                            <span>№123456789-1234</span>
                        </li>
                        <li className={cn('education__list-item')}>
                            <strong>{t('routes.person.education.label.competencies')}</strong>
                            <div className={cn('education__tags')}>
                                <span className={cn('education__tag')}>Антикризисное управление</span>
                            </div>
                        </li>
                        <li className={cn('education__list-item')}>
                            <strong>{t('routes.person.education.label.description')}</strong>
                            <span>Закончил с отличием.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Education;
