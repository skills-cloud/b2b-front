import React, { useState, useMemo, Fragment, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPencil from 'component/icons/pencil';
import Button from 'component/button';
import IconFileImage from 'component/icons/file-image';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';
import VerifyIcon from 'component/verify-icon';

import { career } from 'adapter/api/career';

import CareerEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Career = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { specialistId } = useParams<{ specialistId: string }>();

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { t } = useTranslation();
    const { data } = career.useGetCareerQuery({
        cv_id: parseInt(specialistId, 10)
    }, {
        refetchOnMountOrArgChange: true
    });

    const onClickAdd = useCallback(() => {
        setIsEdit(true);
    }, []);

    const elEdit = useMemo(() => {
        if(isEdit) {
            return (
                <CareerEdit
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
    }, [isEdit, JSON.stringify(data?.results)]);

    const elButtonEdit = useMemo(() => {
        if(data?.results?.length) {
            return (
                <div
                    className={cn('career__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            );
        }
    }, [data?.results?.length]);

    const elEmpty = useMemo(() => {
        if(!data?.results?.length) {
            return (
                <div className={cn('career__empty')}>
                    {t('routes.person.career.empty')}
                    <Button
                        isSecondary={true}
                        children={t('routes.person.career.edit.buttons.append')}
                        onClick={onClickAdd}
                    />
                </div>
            );
        }
    }, [data?.results?.length]);

    const elFileIcon = useCallback((type?: string) => {
        switch (type) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
            case 'jpg':
            case 'png':
            case 'jpeg':
                return <IconFileImage />;

            case 'application/pdf':
                return <IconFilePdf />;

            default:
                return <IconFileDocument />;
        }
    }, []);

    return (
        <Fragment>
            {elEdit}
            <div id={props.id} className={cn('career')}>
                <h2 className={cn('career__header')}>{t('routes.person.career.header')}</h2>
                <div className={cn('career__controls')}>
                    {elButtonEdit}
                </div>
                <div className={cn('career__collection')}>
                    {elEmpty}
                    {data?.results?.map((field, index) => (
                        <div key={index} className={cn('career__education')}>
                            <strong className={cn('career__education-title')}>
                                {field.organization?.name}
                                <VerifyIcon isVerify={field.is_verified} />
                            </strong>
                            <ul className={cn('career__list')}>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.date')}</strong>
                                    <span>{field.date_from} – {field.date_to}</span>
                                </li>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.position')}</strong>
                                    <span>{field.position?.name}</span>
                                </li>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.competencies')}</strong>
                                    <div className={cn('career__tags')}>
                                        {field.competencies?.map((item) => (
                                            <span key={item.id} className={cn('career__tag')}>{item.name}</span>
                                        ))}
                                    </div>
                                </li>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.description')}</strong>
                                    <span>{field.description}</span>
                                </li>
                                {field.projects && (
                                    <li className={cn('career__list-item')}>
                                        <strong>{t('routes.person.career.fields.projects.label')}</strong>
                                        <div className={cn('career__projects')}>
                                            {field.projects.map((project, i) => {
                                                let content = `${project.name}, `;

                                                if(i + 1 === field.projects?.length) {
                                                    content = project.name;
                                                }

                                                return (
                                                    <Link
                                                        target="_blank"
                                                        className={cn('career__project-link')}
                                                        key={i}
                                                        to={`/organizations/${project.organization_id}/projects/${project.id}`}
                                                    >
                                                        {content}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </li>
                                )}
                                {field.files && field.files.length > 0 && (
                                    <li className={cn('career__list-item', 'career__list-item_file')}>
                                        <strong>{t('routes.person.career.fields.files')}</strong>
                                        <div className={cn('career__list-item-files')}>
                                            {field.files.map((file) => (
                                                <span key={file.id} className={cn('career__file-item')}>
                                                    {elFileIcon(file.file_ext)}
                                                    <a href={file.file} target="_blank" rel="noreferrer">{file.file_name}</a>
                                                </span>
                                            ))}
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

export default Career;
