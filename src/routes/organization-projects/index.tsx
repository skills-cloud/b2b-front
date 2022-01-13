import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import Timeframe from 'component/timeframe';
import ShortName from 'component/short-name';
import Wrapper from 'component/section/wrapper';
import EditAction from 'component/section/actions/edit';

import { mainRequest } from 'adapter/api/main';
import { ModulePositionLaborEstimateInline } from 'adapter/types/main/module/get/code-200';

import EditModal from './edit-modal';
import Resources from './resources';
import ModulesList from './modules-list';
import style from './index.module.pcss';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Modules = 'modules'
}

const OrganizationProjects = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { projectId } = useParams<IParams>();

    const [visible, setVisible] = useState<boolean>(false);

    const { data } = mainRequest.useGetMainOrganizationProjectByIdQuery({ id: projectId });

    const { data: modules, isLoading: isLoadingModules } = mainRequest.useGetMainModuleQuery({
        organization_project_id: [parseInt(projectId, 10)]
    });

    const onClickEdit = () => {
        setVisible(true);
    };

    const elEditAction = () => {
        return <EditAction onClick={onClickEdit} />;
    };

    const elSidebar = () => {
        return (
            <Section withoutPaddings={true}>
                <SidebarNav>
                    {Object.values(ESectionInvariants).map((nav) => (
                        <NavItem key={nav} to={`#${nav}`}>
                            {t(`routes.organization-projects.blocks.sections.${nav}`)}
                        </NavItem>
                    ))}
                </SidebarNav>
            </Section>
        );
    };

    const elResources = useMemo(() => {
        if(modules) {
            const resources = modules.results.reduce((acc, curr) => {
                if(curr.positions_labor_estimates?.length) {
                    acc.push(...curr.positions_labor_estimates);
                }

                return acc;
            }, [] as Array<ModulePositionLaborEstimateInline>);

            return <Resources isLoading={isLoadingModules} resources={resources} />;
        }
    }, [JSON.stringify(modules)]);

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={elSidebar()}>
            <Wrapper>
                <Section id={ESectionInvariants.MainInfo}>
                    <span className={cn('organization-project__sub-header')}>
                        {t('routes.organization-projects.sub-header')}
                    </span>
                    <SectionHeader actions={elEditAction()}>{data?.name}</SectionHeader>
                    <SectionContentList>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.customer')}>
                            {data?.organization_customer?.name}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.manager')}>
                            <ShortName lastName={data?.manager?.last_name} firstName={data?.manager?.first_name} />
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.timeframe')}>
                            <Timeframe startDate={data?.date_from} endDate={data?.date_to} />
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.goals')}>
                            {data?.goals}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.industry_sector')}>
                            {data?.industry_sector?.name}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.description')}>
                            {data?.description}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.value')}>
                            {data?.id}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.organization-projects.blocks.resource_plan')}>
                            {data?.plan_description}
                        </SectionContentListItem>
                    </SectionContentList>
                </Section>
                <ModulesList
                    isLoading={isLoadingModules}
                    modules={modules?.results}
                    id={ESectionInvariants.Modules}
                />
                {elResources}
            </Wrapper>
            {visible && <EditModal setVisible={setVisible} fields={data} />}
        </SidebarLayout>
    );
};

export default OrganizationProjects;
