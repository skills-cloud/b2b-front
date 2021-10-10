import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import RequestList from 'component/request-list';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import Timeframe from 'component/timeframe';
import ShortName from 'component/short-name';
import Wrapper from 'component/section/wrapper';

import { mainRequest } from 'adapter/api/main';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Requests = 'requests',
    Timesheets = 'timesheets'
}

const ProjectRequest = () => {
    const { t } = useTranslation();
    const params = useParams<{ organizationId: string, projectId: string }>();
    const { data } = mainRequest.useGetMainOrganizationProjectByIdQuery({
        id: params.projectId
    });
    const { data: requests } = mainRequest.useGetMainRequestQuery({ organization_project_id: params.organizationId });

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
                            to={`/organizations/${params.organizationId}/projects/${params.projectId}/${nav}`}
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
                    <SectionHeader>{data?.name}</SectionHeader>
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
                {requests?.results && (
                    <Section>
                        <span id={ESectionInvariants.Requests} />
                        <SectionHeader>
                            {t('routes.organization-projects.blocks.sections.requests')}
                        </SectionHeader>
                        <RequestList requestList={requests.results} />
                    </Section>
                )}
            </Wrapper>
        </SidebarLayout>
    );
};

export default ProjectRequest;
