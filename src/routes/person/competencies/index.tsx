import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import IconPencil from 'component/icons/pencil';
import IconApply from 'component/icons/apply';
import Tooltip from 'component/tooltip';
import IconFileImage from 'component/icons/file-image';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';

import CompetenciesEdit from './edit';
import style from './index.module.pcss';

export interface IProps {
    id: string
}

const Competencies = (props: IProps) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const [isEdit, setIsEdit] = useState<boolean>(false);

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

    const elFile = useMemo(() => {
        const file = {
            type: 'application/pdf',
            name: 'Резюме',
            url : 'https://www.bosch-professional.com/ru/media/country_content/service/downloads/catalogues/bosch_hk_2015_2016_russland_ru_ru.pdf'
        };

        return (
            <div className={cn('competencies__list-item')}>
                <strong>{t('routes.person.blocks.competencies.files')}</strong>
                <span className={cn('competencies__file-item')}>
                    {elFileIcon(file.type)}
                    <a href={file.url} target="_blank" rel="noreferrer">{file.name}</a>
                </span>
            </div>
        );
    }, []);

    const onClose = () => {
        setIsEdit(false);
    };

    const elModalEdit = useMemo(() => {
        if(isEdit) {
            return (
                <CompetenciesEdit onCancel={onClose} />
            );
        }
    }, [isEdit]);

    return (
        <div id={props.id} className={cn('competencies')}>
            <div className={cn('competencies__info-content-header')}>
                <h2>{t('routes.person.blocks.competencies.title')}</h2>
                <div
                    className={cn('competencies__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            </div>
            <div className={cn('competencies__info-list')}>
                <div className={cn('competencies__info-list-top')}>
                    <h5 className={cn('competencies__info-list-role')}>Senior Front-end Developer</h5>
                    <IconApply
                        svg={{
                            width    : 24,
                            height   : 24,
                            className: cn('competencies__icon-apply')
                        }}
                    />
                </div>
                <div className={cn('competencies__list-item')}>
                    <strong>{t('routes.person.blocks.competencies.skills')}</strong>
                    <div className={cn('competencies__skills')}>
                        <Tooltip content="2 года" theme="dark">
                            <span className={cn('competencies__skills-tag')}>JS</span>
                        </Tooltip>
                        <Tooltip content="2 года" theme="dark">
                            <span className={cn('competencies__skills-tag')}>React</span>
                        </Tooltip>
                        <Tooltip content="2 года" theme="dark">
                            <span className={cn('competencies__skills-tag')}>HTML</span>
                        </Tooltip>
                        <Tooltip content="2 года" theme="dark">
                            <span className={cn('competencies__skills-tag')}>CSS</span>
                        </Tooltip>
                    </div>
                </div>
                {elFile}
            </div>
            {elModalEdit}
        </div>
    );
};

export default Competencies;
