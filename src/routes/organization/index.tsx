import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import Wrapper from 'component/section/wrapper';
import ProjectList from 'route/organization/components/projects';
import ProjectCards from 'component/project-cards';

import { mainRequest } from 'adapter/api/main';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Projects = 'projects',
    Cards = 'cards'
}

const Organization = () => {
    const { t } = useTranslation();
    const params = useParams<{ organizationId: string }>();
    const { data } = mainRequest.useGetMainOrganizationByIdQuery({ id: params.organizationId });
    const { data: projectList } = mainRequest.useGetMainOrganizationProjectListQuery({ organization_id: params.organizationId });

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={
            <Section withoutPaddings={true}>
                <SidebarNav>
                    {Object.values(ESectionInvariants).map((nav) => {
                        return (
                            <NavItem key={nav} to={`/organizations/${params.organizationId}/${nav}`}>
                                {t(`routes.organization.blocks.sections.${nav}`)}
                            </NavItem>
                        );
                    })}
                </SidebarNav>
            </Section>
        }
        >
            <Wrapper>
                <Section>
                    <SectionHeader>{data?.name}</SectionHeader>
                </Section>
                {projectList?.results && <ProjectList list={projectList.results} />}
                <ProjectCards organizationId={params.organizationId} />
            </Wrapper>
        </SidebarLayout>
    );
};

export default Organization;
