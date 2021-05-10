import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Tooltip from 'component/tooltip';
import useClassnames from 'hook/use-classnames';

import Common from './common';
import Photo from './photo';
import Files from './files';
import Certificates from './certificates';
import style from './index.module.pcss';

export const Person = () => {
    const cn = useClassnames(style);
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();

    useEffect(() => {
        console.warn(id);
    }, [id]);

    return (
        <div className={cn('person')}>
            <div className={cn('person__sidebar')}>
                <Photo
                    src="https://avatars.githubusercontent.com/u/8215396?v=4"
                    alt="User photo"
                    isEdit={true}
                />
                <div className={cn('person__block', 'person__links')}>
                    <div className={cn('person__link-wrapper')}>
                        <strong className={cn('person__link')}>{t('routes.person.links.base-info.title')}</strong>
                        <Tooltip content={t('routes.person.links.base-info.tooltip')}><span className={cn('person__link-info')}>!</span></Tooltip>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <strong className={cn('person__link')}>{t('routes.person.links.competencies.title')}</strong>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <strong className={cn('person__link')}>{t('routes.person.links.contacts.title')}</strong>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <strong className={cn('person__link')} data-count="1">{t('routes.person.links.career.title')}</strong>
                        <Tooltip content={t('routes.person.links.career.tooltip')}><span className={cn('person__link-info')}>!</span></Tooltip>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <strong className={cn('person__link')}>{t('routes.person.links.projects.title')}</strong>
                        <Tooltip content={t('routes.person.links.projects.tooltip')}><span className={cn('person__link-info')}>!</span></Tooltip>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <strong className={cn('person__link')} data-count="1">{t('routes.person.links.education.title')}</strong>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-certificates" className={cn('person__link')} data-count="1">{t('routes.person.links.certificates.title')}</a>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-files" className={cn('person__link')} data-count="4">{t('routes.person.links.files.title')}</a>
                    </div>
                </div>
            </div>
            <div className={cn('person__content')}>
                <Common />
                <Certificates id="person-block-certificates" />
                <Files id="person-block-files" />
            </div>
        </div>
    );
};

export default Person;
