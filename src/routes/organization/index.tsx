import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';

import { mainRequest } from 'adapter/api/main';
import ProjectList from 'route/organization/components/projects';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Projects = 'projects',
    Cards = 'cards'
}

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { t } = useTranslation();
    const params = useParams<{ id: string }>();
    const { data } = mainRequest.useGetMainOrganizationByIdQuery({ id: params.id });
    const { data: projectList } = mainRequest.useGetMainOrganizationProjectListQuery({ organization_id: params.id });

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={
            <Section withoutPaddings={true}>
                <SidebarNav>
                    {Object.values(ESectionInvariants).map((nav) => (
                        <NavItem key={nav} to={`#${nav}`} selected={nav === hash.slice(1)}>
                            {t(`routes.organization.blocks.sections.${nav}`)}
                        </NavItem>
                    ))}
                </SidebarNav>
            </Section>
        }
        >
            <div className={cn('sections')} >
                <Section>
                    <SectionHeader>{data?.name}</SectionHeader>
                </Section>
                {projectList?.results && <ProjectList list={projectList.results} />}
                <Section>
                    <SectionHeader>{t('routes.organization.blocks.sections.cards')}</SectionHeader>
                </Section>
            </div>
        </SidebarLayout>
    );
};

export default ProjectRequest;
