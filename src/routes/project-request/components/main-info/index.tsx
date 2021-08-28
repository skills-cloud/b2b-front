import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { format } from 'date-fns';

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

import { mainRequest } from 'src/adapters/api/main';

import { useClassnames } from 'hook/use-classnames';
import useFormatDistance from 'component/dates/format-distance';

import projectRequest from './data.mock';
import style from './index.module.pcss';

const MAIN_INFO_FIELDS = [
    'industry_sector',
    'project',
    'resource_manager',
    'recruiter',
    'type',
    'requirements',
    'project_description',
    'customer'
] as const;

// TODO Добавить поле rest, как будет готов бек
const PROJECT_TERM_FIELDS = ['project-term', 'duration'];
const FORMAT_DATE = 'dd.MM.yyyy';

const MainInfo = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const [visible, setVisible] = useState(false);
    const { id } = useParams<{ id: string }>();
    const formatDistance = useFormatDistance();
    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: parseInt(id, 10) },
        { refetchOnMountOrArgChange: true }
    );

    useModalClose(visible, setVisible);

    if(!data) {
        return null;
    }

    const { project, priority, status, start_date, deadline_date, requirements } = data;

    const renderProjectField = (field: typeof PROJECT_TERM_FIELDS[number]) => {
        let content;

        switch (field) {
            case 'project-term':
                if(start_date && deadline_date) {
                    const startDate = format(new Date(start_date), FORMAT_DATE);
                    const endDate = format(new Date(deadline_date), FORMAT_DATE);

                    content = <React.Fragment>{startDate}&nbsp;&mdash; {endDate}</React.Fragment>;
                }

                break;
            case 'duration':
                if(start_date && deadline_date) {
                    content = formatDistance({ date: new Date(start_date), baseDate: new Date(deadline_date) });
                }
                break;
            case 'rest':
                content = (
                    <React.Fragment>
                        {projectRequest.rest}
                        {`\u00a0(${projectRequest.comment})`}
                    </React.Fragment>
                );
                break;
            default:
                content = data[field]?.name;
        }

        if(content === undefined) {
            content = t('routes.project-request.blocks.empty-field');
        }

        return content;
    };

    const renderField = (field: typeof MAIN_INFO_FIELDS[number]) => {
        let content;

        switch (field) {
            case 'recruiter':
            case 'resource_manager':
                if(data[field]?.last_name && data[field]?.first_name) {
                    content = `${data[field]?.last_name} ${data[field]?.first_name.slice(0, 1)}.`;
                }
                break;
            case 'project_description':
                content = project?.description;
                break;
            case 'requirements':
                content = requirements?.length;
                break;
            default:
                content = data[field]?.name;
        }

        if(content === undefined) {
            content = t('routes.project-request.blocks.empty-field');
        }

        return content;
    };

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
                >{project?.name || t('routes.project-request.blocks.empty-title')}
                </SectionHeader>
            </div>

            {priority && (
                <Tag kind={Tag.kinds.Secondary}>
                    {t(`routes.project-request.blocks.priority.${priority}`)}
                </Tag>
            )}
            {status && (
                <Tag kind={Tag.kinds.Base}>
                    {t(`routes.project-request.blocks.status.${status}`)}
                    {/* TODO Добавить поле прогресса, как будет готово */}
                    {/* {projectRequest.complete < 100 ? `\u00a0${projectRequest.complete}%` : ''} */}
                </Tag>
            )}

            <SectionContentList>
                <H3 id="main-info">{t(`routes.project-request.blocks.sections.${ESectionInvariants.MainInfo}`)}</H3>
                {MAIN_INFO_FIELDS.map((field) => (
                    <SectionContentListItem title={t(`routes.project-request.blocks.main-info.${field}`)} key={field}>
                        {renderField(field)}
                    </SectionContentListItem>
                ))}
            </SectionContentList>

            <Separator />

            <SectionContentList>
                <H3>{t('routes.project-request.blocks.project-term')}</H3>
                {PROJECT_TERM_FIELDS.map((field) => (
                    <SectionContentListItem title={t(`routes.project-request.blocks.${field}`)} key={field}>
                        {renderProjectField(field)}
                    </SectionContentListItem>
                ))}
            </SectionContentList>
            {visible && <EditModal setVisible={setVisible} fields={data} />}
        </Section>
    );
};

export default MainInfo;
