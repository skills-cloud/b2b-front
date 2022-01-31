import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';

import SectionHeader from 'component/section/header';
import EditAction from 'component/section/actions/edit';
import Tag from 'component/tag';
import SectionContentList from 'component/section/content-list';
import { H4 } from 'component/header';
import SectionContentListItem from 'component/section/content-list-item';
import Separator from 'component/separator';
import Section from 'component/section';
import DeleteAction from 'component/section/actions/delete';

import { useClassnames } from 'hook/use-classnames';
import useFormatDistance from 'component/dates/format-distance';

import ESectionInvariants from '../section-invariants';
import EditModal from '../edit-modal';
import ConfirmModal from '../confirm-modal';
import projectRequest from './data.mock';
import style from './index.module.pcss';
import { mainRequest } from 'adapter/api/main';
import useRoles from 'hook/use-roles';

const MAIN_INFO_FIELDS = [
    'industry_sector',
    'organization_project',
    'manager_rm',
    'manager_pm',
    'type',
    'requirements',
    'description',
    'customer'
] as const;

// TODO Добавить поле rest, как будет готов бек
const PROJECT_TERM_FIELDS = ['project-term', 'duration'];
const FORMAT_DATE = 'dd.MM.yyyy';

const MainInfo = () => {
    const params = useParams<IParams>();
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const formatDistance = useFormatDistance();
    const [visible, setVisible] = useState(params?.subpage === 'edit');
    const [confirm, setConfirm] = useState<boolean>(false);

    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.requestId },
        { refetchOnMountOrArgChange: true }
    );

    const { su, pfm, pm, admin } = useRoles(data?.module?.organization_project?.organization_contractor_id);

    const onClickConfirmDelete = () => {
        setConfirm(true);
    };

    const onSetVisible = () => {
        setVisible(false);
    };

    const renderProjectField = (field: typeof PROJECT_TERM_FIELDS[number]) => {
        let content;

        switch (field) {
            case 'project-term':
                if(data?.start_date && data?.deadline_date) {
                    const startDate = format(new Date(data.start_date), FORMAT_DATE);
                    const endDate = format(new Date(data.deadline_date), FORMAT_DATE);

                    content = <React.Fragment>{startDate}&nbsp;&mdash; {endDate}</React.Fragment>;
                }

                break;
            case 'duration':
                if(data?.start_date && data?.deadline_date) {
                    content = formatDistance({ date: new Date(data.start_date), baseDate: new Date(data.deadline_date) });
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
                content = data?.[field]?.name;
        }

        if(content === undefined) {
            content = t('routes.project-request.blocks.empty-field');
        }

        return content;
    };

    const renderField = (field: typeof MAIN_INFO_FIELDS[number]) => {
        let content;

        switch (field) {
            case 'manager_pm': {
                const manager_pm = data?.module?.organization_project?.[field];

                if(manager_pm) {
                    content = `${manager_pm.last_name} ${manager_pm.first_name?.slice(0, 1)}.`;
                }
                break;
            }
            case 'manager_rm':
                if(data?.[field]?.last_name && data[field]?.first_name) {
                    content = `${data[field]?.last_name} ${data[field]?.first_name?.slice(0, 1)}.`;
                }
                break;
            case 'description':
                content = data?.description;
                break;
            case 'requirements':
                content = data?.requirements?.length;
                break;
            case 'customer':
                content = data?.module?.organization_project?.organization_customer?.name;
                break;
            case 'organization_project':
                content = data?.module?.organization_project?.name;
                break;
            default:
                content = data?.[field]?.name;
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
                <SectionHeader dropdownActions={su || admin || pfm || pm ? actions : undefined}>
                    {data?.title || t('routes.project-request.blocks.empty-title')}
                </SectionHeader>
            </div>
        );
    };

    return (
        <Section>
            {elHeader()}
            {data?.priority && (
                <Tag kind={Tag.kinds.Secondary}>
                    {t(`routes.project-request.blocks.priority.${data.priority}`)}
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
            {visible && data && <EditModal setVisible={onSetVisible} fields={data} />}
            {confirm && data?.module?.organization_project && (
                <ConfirmModal
                    setVisible={setConfirm}
                    requestId={String(data.id)}
                    requestName={data.module.organization_project.name}
                />
            )}
        </Section>
    );
};

export default MainInfo;
