import React, { useState, useMemo, Fragment, useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import Button from 'component/button';
import IconFileImage from 'component/icons/file-image';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';
import IconApply from 'component/icons/apply';

import CareerEdit, { IField } from './edit';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

// @TODO: Delete after use API
const DEFAULT_MOCK_LIST: Array<IField> = [{
    company    : 'Google',
    role       : 'Front-end developer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    projects   : 'Медуза, СМИ',
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
    }],
    file: {
        type: 'application/pdf',
        name: 'Резюме',
        url : 'https://www.bosch-professional.com/ru/media/country_content/service/downloads/catalogues/bosch_hk_2015_2016_russland_ru_ru.pdf'
    }
}];

export const Career = (props: IProps) => {
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
                <CareerEdit
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
                    className={cn('career__control')}
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
    }, [fields.length]);

    const elFileIcon = useCallback((type?: string) => {
        switch (type) {
            case 'image/png':
            case 'image/jpg':
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
                    <div
                        className={cn('career__control')}
                        onClick={onClickAdd}
                    >
                        <IconPlus />
                    </div>
                    {elButtonEdit}
                </div>
                <div className={cn('career__collection')}>
                    {elEmpty}
                    {fields.map((field, index) => (
                        <div key={index} className={cn('career__education')}>
                            <strong className={cn('career__education-title')}>
                                {field.company}
                                <IconApply
                                    svg={{
                                        width    : 24,
                                        height   : 24,
                                        className: cn('career__icon-apply')
                                    }}
                                />
                            </strong>
                            <ul className={cn('career__list')}>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.date')}</strong>
                                    <span>{field.date?.from} – {field.date?.to}</span>
                                </li>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.role')}</strong>
                                    <span>{field.role}</span>
                                </li>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.skills')}</strong>
                                    <div className={cn('career__tags')}>
                                        {field.skills?.map(({ label, value }) => (
                                            <span key={value} className={cn('career__tag')}>{label}</span>
                                        ))}
                                    </div>
                                </li>
                                <li className={cn('career__list-item')}>
                                    <strong>{t('routes.person.career.fields.description')}</strong>
                                    <span>{field.description}</span>
                                </li>
                                {field.projects && (
                                    <li className={cn('career__list-item')}>
                                        <strong>{t('routes.person.career.fields.projects')}</strong>
                                        <div className={cn('career__projects')}>
                                            {field.projects}
                                        </div>
                                    </li>
                                )}
                                {field.file && (
                                    <li className={cn('career__list-item')}>
                                        <strong>{t('routes.person.career.fields.files')}</strong>
                                        <span className={cn('career__file-item')}>
                                            {elFileIcon(field.file.type)}
                                            <a href={field.file.url} target="_blank" rel="noreferrer">{field.file.name}</a>
                                        </span>
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
