import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import SectionHeader from 'component/section/header';
import EditAction from 'component/section/edit-action';
import Tag from 'component/tag';
import SectionContentList from 'component/section/content-list';
import { H3 } from 'component/header';
import SectionContentListItem from 'component/section/content-list-item';
import Separator from 'component/separator';
import Section from 'component/section';

import ESectionInvariants from 'route/project-request/components/section-invariants';
import EditModal from 'route/project-request/components/edit-modal';
import useModalClose from 'component/modal/use-modal-close';

import { useClassnames } from 'hook/use-classnames';

import projectRequest from './data.mock';
import style from './index.module.pcss';

const MAIN_INFO_FIELDS = [
    'industry',
    'project',
    'manager',
    'recruiter',
    'request-type',
    'count',
    'description',
    'employer'
];

const PROJECT_TERM_FIELDS = ['project-term', 'duration'];

const MainInfo = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const [visible, setVisible] = useState(false);

    useModalClose(visible, setVisible);

    return (
        <Section>
            <div className={cn('gap-bottom')}>
                <SectionHeader actions={
                    <EditAction
                        onClick={() => {
                            setVisible(true);
                        }}
                    />
                }
                >{projectRequest.title}
                </SectionHeader>
            </div>
            <Tag kind={Tag.kinds.Secondary}>
                {t(`routes.project-request.blocks.priority.${projectRequest.priority}`)}
            </Tag>
            <Tag kind={Tag.kinds.Base}>
                {t('routes.project-request.blocks.status.in-progress')}
                {projectRequest.complete < 100 ? `\u00a0${projectRequest.complete}%` : ''}
            </Tag>

            <SectionContentList>
                <H3 id="main-info">{t(`routes.project-request.blocks.sections.${ESectionInvariants.MainInfo}`)}</H3>

                {MAIN_INFO_FIELDS.map((field) => (
                    <SectionContentListItem title={t(`routes.project-request.blocks.main-info.${field}`)} key={field}>
                        {projectRequest[field]}
                    </SectionContentListItem>
                ))}
            </SectionContentList>

            <Separator />

            <SectionContentList>
                <H3>{t('routes.project-request.blocks.project-term')}</H3>
                {PROJECT_TERM_FIELDS.map((field) => (
                    <SectionContentListItem title={t(`routes.project-request.blocks.${field}`)} key={field}>
                        {projectRequest[field]}
                    </SectionContentListItem>
                ))}
                <SectionContentListItem title={t('routes.project-request.blocks.rest')}>
                    {projectRequest.rest}
                    {`\u00a0(${projectRequest.comment})`}
                </SectionContentListItem>
            </SectionContentList>
            {visible && <EditModal setVisible={setVisible} />}
        </Section>
    );
};

export default MainInfo;
