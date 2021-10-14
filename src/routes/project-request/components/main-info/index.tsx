import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useHistory, useParams } from 'react-router';

import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import Tag from 'component/tag';
import SectionContentList from 'component/section/content-list';
import { H4 } from 'component/header';
import SectionContentListItem from 'component/section/content-list-item';
import Separator from 'component/separator';
import Section from 'component/section';
import DeleteAction from 'component/section/actions/delete';

import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import ESectionInvariants from 'route/project-request/components/section-invariants';

import { useClassnames } from 'hook/use-classnames';
import useFormatDistance from 'component/dates/format-distance';
import useModalClose from 'component/modal/use-modal-close';

import EditModal from '../edit-modal';
import ConfirmModal from '../confirm-modal';
import projectRequest from './data.mock';
import style from './index.module.pcss';

const MAIN_INFO_FIELDS = [
    'industry_sector',
    'organization_project',
    'resource_manager',
    'recruiter',
    'type',
    'requirements',
    'description',
    'customer'
] as const;

// TODO Добавить поле rest, как будет готов бек
const PROJECT_TERM_FIELDS = ['project-term', 'duration'];
const FORMAT_DATE = 'dd.MM.yyyy';

const MainInfo = (data: RequestRead) => {
    const { project, priority, status, start_date, deadline_date, requirements, id } = data;
    const params = useParams<{ subpage?: string, requestId: string }>();
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const history = useHistory();
    const formatDistance = useFormatDistance();
    const [visible, setVisible] = useState(params?.subpage === 'edit');
    const [confirm, setConfirm] = useState<boolean>(false);

    useModalClose(visible, setVisible);

    const onClickConfirmDelete = () => {
        setConfirm(true);
    };

    const onSetVisible = () => {
        setVisible(false);

        history.push(`/requests/${params.requestId}`);
    };

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
            case 'description':
                content = data?.description;
                break;
            case 'requirements':
                content = requirements?.length;
                break;
            case 'customer':
                content = data?.organization_project?.organization?.name;
                break;
            default:
                content = data[field]?.name;
        }

        if(content === undefined) {
            content = t('routes.project-request.blocks.empty-field');
        }

        return content;
    };

    const elHeader = () => {
        const actions = [
            <EditAction
                key="edit"
                onClick={() => setVisible(true)}
                label={t('routes.project-request.blocks.header.controls.edit')}
            />,
            <DeleteAction
                key="delete"
                onClick={onClickConfirmDelete}
                label={t('routes.project-request.blocks.header.controls.delete')}
            />
        ];

        return (
            <div className={cn('main-info__gap-bottom')} id={ESectionInvariants.MainInfo}>
                <SectionHeader dropdownActions={actions}>
                    {data?.title || t('routes.project-request.blocks.empty-title')}
                </SectionHeader>
            </div>
        );
    };

    return (
        <Section>
            {elHeader()}
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
                <H4>{t(`routes.project-request.blocks.sections.${ESectionInvariants.MainInfo}`)}</H4>
                {MAIN_INFO_FIELDS.map((field) => (
                    <SectionContentListItem title={t(`routes.project-request.blocks.main-info.${field}`)} key={field}>
                        {renderField(field)}
                    </SectionContentListItem>
                ))}
            </SectionContentList>

            <Separator />

            <SectionContentList>
                <H4>{t('routes.project-request.blocks.project-term')}</H4>
                {PROJECT_TERM_FIELDS.map((field) => (
                    <SectionContentListItem title={t(`routes.project-request.blocks.${field}`)} key={field}>
                        {renderProjectField(field)}
                    </SectionContentListItem>
                ))}
            </SectionContentList>
            {visible && <EditModal setVisible={onSetVisible} fields={data} />}
            {confirm && project && (
                <ConfirmModal
                    setVisible={setConfirm}
                    requestId={String(id)}
                    requestName={project.name}
                />
            )}
        </Section>
    );
};

export default MainInfo;
