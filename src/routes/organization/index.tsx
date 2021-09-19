import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';

import Section from 'component/section';
import SectionHeader from 'component/section/header';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import { H3 } from 'component/header';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';

import { mainRequest } from 'adapter/api/main';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Projects = 'projects',
    Cards = 'cards'
}

enum EProjectInvariants {
    Period = 'period',
    Industry = 'industry',
    Description = 'description',
    Request = 'request'
}

const ProjectRequest = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { t } = useTranslation();
    const params = useParams<{ id: string }>();
    const { data } = mainRequest.useGetMainOrganizationByIdQuery({ id: params.id });
    const { data: projectList } = mainRequest.useGetMainOrganizationProjectListQuery({ organization_id: params.id });

    const renderField = (field: EProjectInvariants, project: OrganizationProjectRead) => {
        let content = null;

        switch (field) {
            case EProjectInvariants.Description:
                content = project.description;
                break;
            default:
                content = null;
        }

        return (
            <SectionContentListItem title={t(`routes.organization.blocks.project.${field}`)} key={field}>
                {content}
            </SectionContentListItem>
        );
    };

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
                {data && (
                    <Section>
                        <SectionHeader>{data.name}</SectionHeader>
                    </Section>
                )}
                <Section>
                    <SectionHeader>{t('routes.organization.blocks.sections.projects')}</SectionHeader>
                    {projectList?.results.map((item) => (
                        <SectionContentList key={item.id}>
                            <H3>{item?.name}</H3>
                            {Object.values(EProjectInvariants).map((field) => renderField(field, item))}
                        </SectionContentList>
                    ))}
                </Section>
            </div>
        </SidebarLayout>
    );
};

export default ProjectRequest;
