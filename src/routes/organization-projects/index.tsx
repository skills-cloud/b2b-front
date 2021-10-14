import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import useClassnames from 'hook/use-classnames';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import RequestList from 'component/request-list';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import Timeframe from 'component/timeframe';
import ShortName from 'component/short-name';
import ProjectCards from 'component/project-cards';
import Wrapper from 'component/section/wrapper';
import Loader from 'component/loader';
import EditAction from 'component/section/actions/edit';

import { mainRequest } from 'adapter/api/main';

import EditModal from './edit-modal';
import style from './index.module.pcss';
import AddAction from 'component/section/actions/add';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Requests = 'requests',
    Timesheets = 'timesheets'
}

const OrganizationProjects = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const { projectId, organizationId } = useParams<{ organizationId: string, projectId: string }>();

    const [visible, setVisible] = useState<boolean>(false);

    const { data } = mainRequest.useGetMainOrganizationProjectByIdQuery({ id: projectId });
    const { data: requests, isLoading } = mainRequest.useGetMainRequestQuery({ organization_project_id: projectId });

    const elRequests = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(requests?.results.length) {
            return <RequestList fromOrganization={true} requestList={requests.results} />;
        }

        return (
            <div className={cn('organization-projects__empty')}>
                {t('routes.organization-projects.empty')}
            </div>
        );
    };

    const onClickEdit = () => {
        setVisible(true);
    };

    const elEditAction = () => {
        return <EditAction onClick={onClickEdit} />;
    };

    const elCreateRequest = () => {
        return <AddAction to={`/organizations/${organizationId}/projects/${projectId}/requests/create`} />;
    };

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={
            <Section withoutPaddings={true}>
                <SidebarNav>
                    {Object.values(ESectionInvariants).map((nav) => (
                        <NavItem
                            key={nav}
                            to={`/organizations/${organizationId}/projects/${projectId}/${nav}`}
                        >
                            {t(`routes.organization-projects.blocks.sections.${nav}`)}
                        </NavItem>
                    ))}
                </SidebarNav>
            </Section>
        }
        >
            <Wrapper>
                <Section>
                    <span id={ESectionInvariants.MainInfo} />
                    <SectionHeader actions={elEditAction()}>{data?.name}</SectionHeader>
                    <SectionContentList>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.customer')}>
                            {data?.organization?.name}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.manager')}>
                            <ShortName lastName={data?.manager?.last_name} firstName={data?.manager?.first_name} />
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.timeframe')}>
                            <Timeframe startDate={data?.date_from} endDate={data?.date_to} />
                        </SectionContentListItem>
                    </SectionContentList>
                </Section>
                <Section>
                    <span id={ESectionInvariants.Requests} />
                    <SectionHeader actions={elCreateRequest()}>
                        {t('routes.organization-projects.blocks.sections.requests')}
                    </SectionHeader>
                    {elRequests()}
                </Section>
                <ProjectCards projectId={projectId} organizationId={organizationId} />
            </Wrapper>
            {visible && <EditModal setVisible={setVisible} fields={data} />}
        </SidebarLayout>
    );
};

export default OrganizationProjects;
