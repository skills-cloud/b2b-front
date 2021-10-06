import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
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

import { mainRequest } from 'adapter/api/main';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Requests = 'requests',
    Timesheet = 'timesheet'
}

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { t } = useTranslation();
    const { projectId } = useParams<{ organizationId: string, projectId: string }>();
    const { data } = mainRequest.useGetMainOrganizationProjectByIdQuery({
        id: projectId
    });
    const { data: requests } = mainRequest.useGetMainRequestQuery({ organization_project_id: projectId });

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={
            <Section withoutPaddings={true}>
                <SidebarNav>
                    {Object.values(ESectionInvariants).map((nav) => (
                        <NavItem key={nav} to={`#${nav}`} selected={nav === hash.slice(1)}>
                            {t(`routes.organization-projects.blocks.sections.${nav}`)}
                        </NavItem>
                    ))}
                </SidebarNav>
            </Section>
        }
        >
            <div className={cn('sections')} >
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
            </div>
        </SidebarLayout>
    );
};

export default ProjectRequest;
