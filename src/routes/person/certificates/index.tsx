import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import IconApply from 'component/icons/apply';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Certificates = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    return (
        <div id={props.id} className={cn('certificates')}>
            <h2 className={cn('certificates__header')}>{t('routes.person.certificates.header')}</h2>
            <div className={cn('certificates__controls')}>
                <div className={cn('certificates__control', 'certificates__control_disable')}>
                    <IconPlus />
                </div>
                <div className={cn('certificates__control', 'certificates__control_disable')}>
                    <IconPencil />
                </div>
            </div>
            <div className={cn('certificates__collection')}>
                <div className={cn('certificates__certificate')}>
                    <strong className={cn('certificates__certificate-title')}>
                        Повышение квалификации
                        <IconApply
                            svg={{
                                width    : 24,
                                height   : 24,
                                className: cn('certificates__icon-apply')
                            }}
                        />
                    </strong>
                    <ul className={cn('certificates__list')}>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.issued')}</strong>
                            <span>30.12.2013</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.specialty')}</strong>
                            <span>HR</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.power')}</strong>
                            <span>Специалист</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.number')}</strong>
                            <span>№1312312313</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.competencies')}</strong>
                            <div className={cn('certificates__tags')}>
                                <span className={cn('certificates__tag')}>Подбор персонала</span>
                            </div>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.description')}</strong>
                            <span>https://link.com</span>
                        </li>
                    </ul>
                </div>
                <div className={cn('certificates__certificate')}>
                    <strong className={cn('certificates__certificate-title')}>
                        Повышение квалификации
                        <IconApply
                            svg={{
                                width    : 24,
                                height   : 24,
                                className: cn('certificates__icon-apply')
                            }}
                        />
                    </strong>
                    <ul className={cn('certificates__list')}>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.issued')}</strong>
                            <span>30.12.2013</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.specialty')}</strong>
                            <span>HR</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.power')}</strong>
                            <span>Специалист</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.number')}</strong>
                            <span>№1312312313</span>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.competencies')}</strong>
                            <div className={cn('certificates__tags')}>
                                <span className={cn('certificates__tag')}>Подбор персонала</span>
                            </div>
                        </li>
                        <li className={cn('certificates__list-item')}>
                            <strong>{t('routes.person.certificates.label.description')}</strong>
                            <span>https://link.com</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Certificates;
