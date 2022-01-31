import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import Wrapper from 'component/section/wrapper';
import ProjectList from 'route/organization/components/projects';
import ProjectCards from 'component/project-cards';

import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Projects = 'projects',
    Cards = 'cards'
}

const Organization = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const { organizationId } = useParams<IParams>();
    const { data } = mainRequest.useGetMainOrganizationByIdQuery({ id: organizationId });
    const { data: projectsData } = mainRequest.useGetMainOrganizationProjectListQuery({
        organization_customer_id: [parseInt(organizationId, 10)]
    }, {
        skip: !organizationId || !data || (data?.is_contractor && !data?.is_customer)
    });

    const elSidebar = () => {
        const listToRender = Object.values(ESectionInvariants);

        if(data?.is_contractor) {
            listToRender.splice(1, 2);
        }

        return (
            <SidebarNav>
                {listToRender.map((nav) => {
                    return (
                        <NavItem key={nav} to={`#${nav}`}>
                            {t(`routes.organization.blocks.sections.${nav}`)}
                        </NavItem>
                    );
                })}
            </SidebarNav>
        );
    };

    const elProjectCards = () => {
        if(data?.is_customer) {
            return (
                <ProjectCards
                    projects={projectsData?.results?.map((item) => ({
                        value: String(item.id),
                        label: item.name
                    }))}
                />
            );
        }
    };

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={
            <Section withoutPaddings={true}>
                {elSidebar()}
            </Section>
        }
        >
            <Wrapper>
                <Section>
                    <Wrapper>
                        <SectionHeader>{data?.name}</SectionHeader>
                        <div className={cn('organization__list-item-block', 'organization__list-item-block_row')}>
                            <span className={cn('organization__list-item-span')}>{t('routes.organization.description.title')}</span>
                            <p className={cn('organization__list-item-text')}>
                                {data?.description || t('routes.organization.description.empty')}
                            </p>
                        </div>
                    </Wrapper>
                </Section>
                {data?.is_customer && <ProjectList isContractor={data?.is_contractor} isCustomer={data?.is_customer} />}
                {elProjectCards()}
            </Wrapper>
        </SidebarLayout>
    );
};

export default Organization;
