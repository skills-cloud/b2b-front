import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import IconApply from 'component/icons/apply';
import TooltipError from 'component/tooltip';
import IconWarning from 'component/icons/warning';
import Section from 'component/section';
import Button from 'component/button';
import Request from 'component/request';

import Common from './common';
import Photo from './photo';
import Files from './files';
import Certificates from './certificates';
import Education from './education';
import Projects from './projects';
import Access from './access';
import Career from './career';
import Competencies from './competencies';

import { cv } from 'adapter/api/cv';

import style from './common/index.module.pcss';

export const Person = () => {
    const cn = useClassnames(style);
    const { specialistId } = useParams<IParams>();
    const { t } = useTranslation();

    const [showModal, setShowModal] = useState<boolean>(false);

    const { data } = cv.useGetCvByIdQuery({ id: specialistId });

    const onClickShowModal = () => {
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className={cn('person')}>
            <div className={cn('person__sidebar')}>
                <Photo
                    alt="User photo"
                    isEdit={true}
                />
                <div className={cn('person__block', 'person__links')}>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-common" className={cn('person__link')}>{t('routes.person.links.base-info.title')}</a>
                        <TooltipError content="Всё ок">
                            <IconApply
                                svg={{
                                    width    : 24,
                                    height   : 24,
                                    className: cn('person__icon-apply')
                                }}
                            />
                        </TooltipError>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-competencies" className={cn('person__link')}>{t('routes.person.links.competencies.title')}</a>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-career" className={cn('person__link')} data-count="1">{t('routes.person.links.career.title')}</a>
                        <TooltipError content="Что-то не ок">
                            <IconWarning
                                svg={{
                                    width    : 24,
                                    height   : 24,
                                    className: cn('person__icon-warning')
                                }}
                            />
                        </TooltipError>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-projects" className={cn('person__link')}>{t('routes.person.links.projects.title')}</a>
                        <TooltipError content="Что-то не ок">
                            <IconWarning
                                svg={{
                                    width    : 24,
                                    height   : 24,
                                    className: cn('person__icon-warning')
                                }}
                            />
                        </TooltipError>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-education" className={cn('person__link')} data-count="1">{t('routes.person.links.education.title')}</a>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-certificates" className={cn('person__link')} data-count="1">{t('routes.person.links.certificates.title')}</a>
                    </div>
                    <div className={cn('person__link-wrapper')}>
                        <a href="#person-block-files" className={cn('person__link')} data-count="4">{t('routes.person.links.files.title')}</a>
                    </div>
                </div>
                <Section className={cn('person__project')}>
                    <Button type="button" onClick={onClickShowModal}>
                        {t('routes.person.add-specialist')}
                    </Button>
                </Section>
            </div>
            <div className={cn('person__content')}>
                <Common id="person-block-common" />
                <Competencies id="person-block-competencies" />
                <Access id="person-block-access" />
                <Career id="person-block-career" />
                <Projects id="person-block-projects" />
                <Education id="person-block-education" />
                <Certificates id="person-block-certificates" />
                <Files id="person-block-files" />
            </div>
            {showModal && <Request specialistId={parseInt(specialistId, 10)} onClickClose={onCloseModal} />}
        </div>
    );
};

export default Person;
