import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams, ORGANIZATION_PROJECT_MODULE_REQUEST_CREATE } from 'helper/url-list';
import useRoles from 'hook/use-roles';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import SectionHeader from 'component/section/header';
import RequestList from 'component/request-list';
import SectionContentList from 'component/section/content-list';
import SectionContentListItem from 'component/section/content-list-item';
import ShortName from 'component/short-name';
import Wrapper from 'component/section/wrapper';
import Loader from 'component/loader';
import EditAction from 'component/section/actions/edit';
import AddAction from 'component/section/actions/add';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DotsAction from 'component/section/actions/dots';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DeleteAction from 'component/section/actions/delete';
import Empty from 'component/empty';

import { mainRequest } from 'adapter/api/main';

import ConfirmModal from './confirm-modal';
import EditModal from './edit';
import FunPointsComponent from './fun-points';
import ResourceValueComponent from './resource-value';

enum ESectionInvariants {
    MainInfo = 'main-info',
    ResourceValue = 'resource-value',
    FunPoints = 'fun-points',
    Requests = 'requests'
}

const Module = () => {
    const { t } = useTranslation();
    const { organizationId, moduleId, projectId } = useParams<IParams>();

    const [visible, setVisible] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const { data } = mainRequest.useGetMainModuleByIdQuery({ id: moduleId });
    const { data: requests, isLoading } = mainRequest.useGetMainRequestQuery({
        organization_project_id: [parseInt(projectId, 10)]
    });
    const { su, pfm, pm, admin } = useRoles(data?.organization_project?.organization_contractor_id);

    const elRequests = () => {
        if(isLoading) {
            return <Loader />;
        }

        if(requests?.results.length) {
            return (
                <RequestList
                    fromOrganization={true}
                    requestList={requests.results}
                    isUserHasPermission={su || admin || pfm || pm}
                />
            );
        }

        return <Empty>{t('routes.module.blocks.empty')}</Empty>;
    };

    const onClickEdit = () => {
        setVisible(true);
    };

    const onClickDelete = () => {
        setDeleting(true);
    };

    const elActions = () => {
        if(su || admin || pfm || pm) {
            return (
                <Dropdown
                    render={({ onClose }) => (
                        <DropdownMenu>
                            <DropdownMenuItem selected={false} onClick={onClose}>
                                <EditAction onClick={onClickEdit} label={t('routes.module.blocks.actions.edit')} />
                            </DropdownMenuItem>
                            <DropdownMenuItem selected={false} onClick={onClose}>
                                <DeleteAction onClick={onClickDelete} label={t('routes.module.blocks.actions.delete')} />
                            </DropdownMenuItem>
                        </DropdownMenu>
                    )}
                >
                    <DotsAction />
                </Dropdown>
            );
        }
    };

    const elCreateRequest = () => {
        if(su || admin || pfm || pm) {
            return <AddAction to={ORGANIZATION_PROJECT_MODULE_REQUEST_CREATE(organizationId, projectId, moduleId)} />;
        }
    };

    const elSidebar = () => {
        return (
            <Section withoutPaddings={true}>
                <SidebarNav>
                    {Object.values(ESectionInvariants).map((nav) => (
                        <NavItem key={nav} to={`#${nav}`}>
                            {t(`routes.module.blocks.sections.${nav}`)}
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
                    <SectionHeader actions={elActions()}>{data?.name}</SectionHeader>
                    <SectionContentList>
                        <SectionContentListItem title={t('routes.module.blocks.customer')}>
                            {data?.organization_project?.organization_customer?.name}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.module.blocks.goals')}>
                            {data?.goals}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.module.blocks.start')}>
                            {data?.start_date}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.module.blocks.deadline')}>
                            {data?.deadline_date}
                        </SectionContentListItem>
                        <SectionContentListItem title={t('routes.module.blocks.description')}>
                            {data?.description}
                        </SectionContentListItem>
                    </SectionContentList>
                </Section>
                <FunPointsComponent
                    isUserHasPermission={su || admin || pfm || pm}
                    id={ESectionInvariants.FunPoints}
                    funPoints={data?.fun_points}
                    difficulty={data?.difficulty_factor}
                    isLoading={isLoading}
                />
                <ResourceValueComponent
                    isUserHasPermission={su || admin || pfm || pm}
                    id={ESectionInvariants.ResourceValue}
                    resourceValue={data?.positions_labor_estimates}
                    isLoading={isLoading}
                />
                <Section id={ESectionInvariants.Requests}>
                    <SectionHeader actions={elCreateRequest()}>
                        {t('routes.module.blocks.sections.requests')}
                    </SectionHeader>
                    {elRequests()}
                </Section>
            </Wrapper>
            {visible && <EditModal setVisible={setVisible} fields={data} />}
            {deleting && <ConfirmModal setVisible={setDeleting} moduleName={data.name} />}
        </SidebarLayout>
    );
};

export default Module;
