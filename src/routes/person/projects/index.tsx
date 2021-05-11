import React, { useState, useMemo, Fragment, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import IconApproved from 'component/icons/approved';
import Button from 'component/button';

import ProjectsEdit, { IField } from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

// @TODO: Delete after use API
const DEFAULT_MOCK_LIST: Array<IField> = [{
    name       : 'Search Engine',
    customer   : 'Google',
    role       : 'Front-end developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    date       : {
        from: '2021-05-03',
        to  : '2021-05-31'
    },
    skills: [{
        label: 'Sound Masking',
        value: '31505'
    }, {
        label: 'Flask',
        value: '13175'
    }, {
        label: 'Market Basket Analysis',
        value: '20525'
    }]
}];

export const Projects = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [fields, setFields] = useState<Array<IField>>(DEFAULT_MOCK_LIST);
    const { t } = useTranslation();

    const onClickAdd = useCallback(() => {
        unstable_batchedUpdates(() => {
            setFields((state) => [
                ...state,
                {}
            ]);
            setIsEdit(true);
        });
    }, []);

    const elEdit = useMemo(() => {
        if(isEdit) {
            return (
                <ProjectsEdit
                    fields={fields}
                    onSubmit={(payload) => {
                        unstable_batchedUpdates(() => {
                            setFields(payload);
                            setIsEdit(false);
                        });
                    }}
                    onCancel={() => {
                        setIsEdit(false);
                    }}
                />
            );
        }
    }, [isEdit, fields]);

    const elButtonEdit = useMemo(() => {
        if(fields.length) {
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
        }
    }, [fields.length]);

    const elEmpty = useMemo(() => {
        if(!fields.length) {
            return (
                <div className={cn('projects__empty')}>
                    {t('routes.person.projects.empty')}
                    <Button
                        isSecondary={true}
                        children={t('routes.person.projects.edit.buttons.append')}
                        onClick={onClickAdd}
                    />
                </div>
            );
        }
    }, [fields.length]);

    return (
        <Fragment>
            {elEdit}
            <div id={props.id} className={cn('projects')}>
                <h1 className={cn('projects__header')}>{t('routes.person.projects.header')}</h1>
                <div className={cn('projects__controls')}>
                    <div
                        className={cn('projects__control')}
                        onClick={onClickAdd}
                    >
                        <IconPlus />
                    </div>
                    {elButtonEdit}
                </div>
                <div className={cn('projects__collection')}>
                    {elEmpty}
                    {fields.map((field, index) => (
                        <div key={index} className={cn('projects__education')}>
                            <strong className={cn('projects__education-title')}>
                                {field.name}
                                <IconApproved
                                    svg={{
                                        className: cn('projects__icon')
                                    }}
                                />
                            </strong>
                            <ul className={cn('projects__list')}>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.customer')}</strong>
                                    <span>{field.customer}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.date')}</strong>
                                    <span>{field.date?.from} – {field.date?.to}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.role')}</strong>
                                    <span>{field.role}</span>
                                </li>
                                <li className={cn('projects__list-item')}>
                                    <strong>{t('routes.person.projects.fields.skills')}</strong>
                                    <div className={cn('projects__tags')}>
                                        {field.skills?.map(({ label, value }) => (
                                            <span key={value} className={cn('projects__tag')}>{label}</span>
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
