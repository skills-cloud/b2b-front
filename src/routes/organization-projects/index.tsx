import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { ORGANIZATION_PROJECT_ID } from 'helper/url-list';

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

import EditModal from './edit-modal';
import ModulesList from './modules-list';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Modules = 'modules'
}

const OrganizationProjects = () => {
    const { t } = useTranslation();
    const { projectId, organizationId } = useParams<{ organizationId: string, projectId: string }>();

    const [visible, setVisible] = useState<boolean>(false);

    const { data } = mainRequest.useGetMainOrganizationProjectByIdQuery({ id: projectId });

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
                        <NavItem
                            key={nav}
                            to={`${ORGANIZATION_PROJECT_ID(organizationId, projectId)}/${nav}`}
                        >
                            {t(`routes.organization-projects.blocks.sections.${nav}`)}
                        </NavItem>
                    ))}
                </SidebarNav>
            </Section>
        );
    };

    if(!data) {
        return null;
    }

    return (
        <SidebarLayout sidebar={elSidebar()}>
            <Wrapper>
                <Section id={ESectionInvariants.MainInfo}>
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
                <ModulesList id={ESectionInvariants.Modules} />
                {/* <Resouces />*/}
            </Wrapper>
            {visible && <EditModal setVisible={setVisible} fields={data} />}
        </SidebarLayout>
    );
};

export default OrganizationProjects;
