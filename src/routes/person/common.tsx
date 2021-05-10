import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';
import IconEdit from 'component/icons/edit';
import IconApply from 'component/icons/apply';

import style from './index.module.pcss';

export interface IProps {
    id?: string
}

export const Common = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const [more, setMore] = useState<boolean>(false);

    const onClickMore = useCallback(() => {
        setMore(true);
    }, []);

    const elBaseMore = useMemo(() => {
        if(more) {
            return (
                <Fragment>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.base.location')}</strong>
                        <span>Москва</span>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                        <span>StarHr</span>
                    </div>
                </Fragment>
            );
        }
    }, [more]);

    return (
        <div id={props.id} className={cn('person__block', 'person__info')}>
            <div className={cn('person__info-header')}>
                <h2>Сергей Андреевич Иванов</h2>
                <IconEdit
                    svg={{
                        fill   : 'none',
                        viewBox: '-1 -1 24 24'
                    }}
                />
            </div>
            <div className={cn('person__info-content')}>
                <div className={cn('person__info-content-header')}>
                    <h4>{t('routes.person.blocks.common.base.title')}</h4>
                    <IconApply
                        svg={{
                            width    : 24,
                            height   : 24,
                            className: cn('person__icon-apply')
                        }}
                    />
                </div>
                <div className={cn('person__info-list')}>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.base.age')}</strong>
                        <span>29 лет (2 марта 1991)</span>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.base.location')}</strong>
                        <span>Москва</span>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.base.resource-owner')}</strong>
                        <span>StarHr</span>
                    </div>
                    {elBaseMore}
                </div>
                {!more && <p onClick={onClickMore} className={cn('person__more-info')}>{t('routes.person.blocks.common.base.show-more')}</p>}
            </div>
            <div className={cn('person__info-content')}>
                <div className={cn('person__info-content-header')}>
                    <h4>{t('routes.person.blocks.common.contacts.title')}</h4>
                    <IconApply
                        svg={{
                            width    : 24,
                            height   : 24,
                            className: cn('person__icon-apply', {
                                'person__icon-apply_filled': true
                            })
                        }}
                    />
                </div>
                <div className={cn('person__info-list')}>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.contacts.email')}</strong>
                        <span>anton@gmail.com</span>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.contacts.telephone')}</strong>
                        <span>+7 922 230 33 56</span>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.contacts.skype')}</strong>
                        <span>anton.s13</span>
                    </div>
                </div>
            </div>
            <div className={cn('person__info-content')}>
                <div className={cn('person__info-content-header')}>
                    <h4>{t('routes.person.blocks.common.competencies.title')}</h4>
                    <IconApply
                        svg={{
                            width    : 24,
                            height   : 24,
                            className: cn('person__icon-apply')
                        }}
                    />
                </div>
                <div className={cn('person__info-list')}>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.competencies.role')}</strong>
                        <span>Senior Front-end Developer</span>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.competencies.skills')}</strong>
                        <div className={cn('person__skills')}>
                            <span className={cn('person__skills-tag')}>JS</span>
                            <span className={cn('person__skills-tag')}>React</span>
                            <span className={cn('person__skills-tag')}>HTML</span>
                            <span className={cn('person__skills-tag')}>CSS</span>
                        </div>
                    </div>
                    <div className={cn('person__info-list-item')}>
                        <strong>{t('routes.person.blocks.common.competencies.comment')}</strong>
                        <span>Сложные интерфейсы. Работа с WebRTC, SQL.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Common;
