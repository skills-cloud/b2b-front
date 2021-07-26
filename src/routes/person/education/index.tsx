import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { education } from 'adapter/api/education';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPencil from 'component/icons/pencil';
import IconApply from 'component/icons/apply';
import Header, { H3 } from 'component/header';
import ModalEdit from './edit';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Education = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
    const { data } = education.useGetEducationQuery({ cv_id: parseInt(id, 10) }, { refetchOnMountOrArgChange: true });

    return (
        <div id={props.id} className={cn('education')}>
            <Header level={1} tag="h2">
                {t('routes.person.education.header')}
            </Header>
            <div className={cn('education__controls')}>
                <div
                    className={cn('education__control')}
                    onClick={() => {
                        setVisibleEditModal(true);
                    }}
                >
                    <IconPencil />
                </div>
            </div>
            <div className={cn('education__collection')}>
                <div className={cn('education__education')}>
                    {data?.results.map((result) => {
                        const {
                            date_from,
                            date_to,
                            education_speciality,
                            description,
                            education_graduate,
                            is_verified,
                            education_place,
                            competencies
                        } = result;

                        return (
                            <Fragment key={result.id}>
                                <div className={cn('education__education-title')}>
                                    <H3 contrast={true}>{education_place?.name}</H3>
                                    {is_verified && (
                                        <IconApply
                                            svg={{
                                                width    : 24,
                                                height   : 24,
                                                className: cn('education__icon-apply')
                                            }}
                                        />
                                    )}
                                </div>
                                <ul className={cn('education__list')}>
                                    <li className={cn('education__list-item')}>
                                        <strong>{t('routes.person.education.label.period')}</strong>
                                        <span>
                                            {date_from}&nbsp;&mdash; {date_to}
                                        </span>
                                    </li>
                                    <li className={cn('education__list-item')}>
                                        <strong>{t('routes.person.education.label.specialty')}</strong>
                                        <span>{education_speciality?.name}</span>
                                    </li>
                                    <li className={cn('education__list-item')}>
                                        <strong>{t('routes.person.education.label.power')}</strong>
                                        <span>{education_graduate?.name}</span>
                                    </li>
                                    <li className={cn('education__list-item')}>
                                        <strong>{t('routes.person.education.label.diploma')}</strong>
                                        {/* TODO нет поля в ответе от бека, хак для демо*/}
                                        <span>{`№123456789-${id}`}</span>
                                    </li>
                                    {competencies.length > 0 && (
                                        <li className={cn('education__list-item')}>
                                            <strong>{t('routes.person.education.label.competencies')}</strong>

                                            <div className={cn('education__tags')}>
                                                {competencies.map((competence) => (
                                                    <span className={cn('education__tag')} key={competence.id}>
                                                        {competence.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </li>
                                    )}
                                    <li className={cn('education__list-item')}>
                                        <strong>{t('routes.person.education.label.description')}</strong>
                                        <span>{description}</span>
                                    </li>
                                </ul>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
            {visibleEditModal && (
                <ModalEdit
                    fields={data?.results}
                    onSubmit={() => {
                        setVisibleEditModal(false);
                    }}
                    onCancel={() => {
                        setVisibleEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Education;
