import React, { useState, useMemo, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames, { IStyle } from 'hook/use-classnames';

import IconPencil from 'component/icons/pencil';
import VerifyIcon from 'component/verify-icon';

import { project } from 'adapter/api/project';

import ProjectsEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Projects = (props: IProps) => {
    const { specialistId } = useParams<IParams>();
    const cn = useClassnames(style, props.className, true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { t } = useTranslation();

    const { data } = project.useGetProjectsListQuery({ cv_id: specialistId }, { refetchOnMountOrArgChange: true });

    const elEdit = useMemo(() => {
        if(isEdit) {
            return (
                <ProjectsEdit
                    fields={data?.results}
                    onSubmit={() => {
                        setIsEdit(false);
                    }}
                    onCancel={() => {
                        setIsEdit(false);
                    }}
                />
            );
        }
    }, [isEdit, data?.results]);

    const elButtonEdit = useMemo(() => {
        return (
            <div
                className={cn('projects__control')}
                onClick={() => {
                    setIsEdit(true);
                }}
            >
                <IconPencil />
            </div>
        );
    }, [data?.results?.length]);

    const elEmpty = useMemo(() => {
        if(!data?.results?.length) {
            return (
                <div className={cn('projects__empty')}>
                    {t('routes.person.projects.empty')}
                </div>
            );
        }
    }, [data?.results?.length]);

    return (
        <Fragment>
            {elEdit}
            <div id={props.id} className={cn('projects')}>
                <h2 className={cn('projects__header')}>{t('routes.person.projects.header')}</h2>
                <div className={cn('projects__controls')}>
                    {elButtonEdit}
                </div>
                <div className={cn('projects__collection')}>
                    {elEmpty}
                    {data?.results?.map((field, index) => (
                        <div key={index} className={cn('projects__education')}>
                            <strong className={cn('projects__education-title')}>
                                {field.name}
                                <VerifyIcon isVerify={field.is_verified} />
                            </strong>
                            <ul className={cn('projects__list')}>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.customer')}</strong>
                                    <span>{field.organization?.name}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.date')}</strong>
                                    <span>{field.date_from} – {field.date_to}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.position')}</strong>
                                    <span>{field.position?.name}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.customer')}</strong>
                                    <span>{field.organization?.name}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.competencies')}</strong>
                                    <div className={cn('projects__tags')}>
                                        {field.competencies?.map((item) => (
                                            <span key={item.id} className={cn('projects__tag')}>{item.name}</span>
                                        ))}
                                    </div>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.description')}</strong>
                                    <span>{field.description}</span>
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

export default Projects;
