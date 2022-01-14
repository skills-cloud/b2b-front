import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames, { IStyle } from 'hook/use-classnames';

import IconPencil from 'component/icons/pencil';
import Header, { H4 } from 'component/header';
import VerifyIcon from 'component/verify-icon';
import Loader from 'component/loader';
import Empty from 'component/empty';

import { education } from 'adapter/api/education';

import ModalEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Education = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { specialistId } = useParams<IParams>();
    const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
    const { data, isLoading } = education.useGetEducationQuery({ cv_id: parseInt(specialistId, 10) }, { refetchOnMountOrArgChange: true });

    const elContent = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
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
                                competencies,
                                diploma_number
                            } = result;

                            return (
                                <Fragment key={result.id}>
                                    <div className={cn('education__education-title')}>
                                        <H4 contrast={true}>{education_place?.name}</H4>
                                        <VerifyIcon isVerify={is_verified} />
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
                                            <span>{diploma_number}</span>
                                        </li>
                                        {competencies && competencies.length > 0 && (
                                            <li className={cn('education__list-item')}>
                                                <strong>{t('routes.person.education.label.competencies')}</strong>

                                                <div className={cn('education__tags')}>
                                                    {competencies?.map((competence) => (
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
            );
        }

        return <Empty>{t('routes.person.education.empty')}</Empty>;
    };

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
            {elContent()}
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
