import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';

import { useClassnames } from 'hook/use-classnames';

import Section from 'component/section';
import SidebarLayout from 'component/layout/sidebar';
import SidebarNav, { NavItem } from 'component/nav';
import IconDots from 'component/icons/dots';
import IconChecked from 'component/icons/checked';
import IconExpand from 'component/icons/expand';
import IconCollapse from 'component/icons/collapse';
import SectionHeader from 'component/section/header';
import Wrapper from 'component/section/wrapper';
import ProjectList from 'route/organization/components/projects';
import AddAction from 'component/section/actions/add';
import useModalClose from 'component/modal/use-modal-close';
import Modal from 'component/modal';
import TreeList from 'component/tree-list';

import { mainRequest } from 'adapter/api/main';

import CardItem from './components/card-item';

import style from './index.module.pcss';

enum ESectionInvariants {
    MainInfo = 'main-info',
    Projects = 'projects',
    Cards = 'cards'
}

const Organization = () => {
    const cn = useClassnames(style);
    const [visibleModalId, setVisibleModalId] = useState<number | null>(null);
    const [showAllTree, setShowAllTree] = useState(false);
    const [checked, setChecked] = useState<Array<string>>([]);
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const params = useParams<{ organizationId: string }>();
    const { data } = mainRequest.useGetMainOrganizationByIdQuery({ id: params.organizationId });
    const { data: projectList } = mainRequest.useGetMainOrganizationProjectListQuery({ organization_id: params.organizationId });
    const { data: cards, isLoading } = mainRequest.useGetOrganizationProjectCardItemQuery({
        organization_id: [params.organizationId]
    });

    useModalClose(!!visibleModalId || showAllTree, (state) => {
        if(!state) {
            setVisibleModalId(null);
            setShowAllTree(false);
        }
    });

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
                {cards && (
                    <Section>
                        <SectionHeader actions={
                            <AddAction onClick={() => {
                                setShowAllTree(true);
                            }}
                            />
                        }
                        >
                            {t('routes.organization.blocks.sections.cards')}
                        </SectionHeader>
                        <div className={cn('organization__cards')}>
                            {cards?.map(({ id, name, children }, index) => (
                                <div className={cn('organization__card')} key={id}>
                                    <div className={cn('organization__card-icon-wrapper')}>
                                        <IconChecked
                                            svg={{
                                                className: cn('organization__card-icon')
                                            }}
                                        />
                                    </div>
                                    <div className={cn('organization__card-name')}>
                                        {name}
                                    </div>
                                    <div className={cn('organization__card-count')}>
                                        {t('routes.organization.blocks.cards-count', {
                                            count: children.length
                                        })}
                                    </div>
                                    <div className={cn('organization__card-edit')}>
                                        <IconDots
                                            svg={{
                                                onClick: () => {
                                                    if(id) {
                                                        setVisibleModalId(index);
                                                    }
                                                },
                                                className: cn('organization__card-icon')
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}
                {(visibleModalId !== null || showAllTree) && cards !== undefined && (
                    <Modal
                        header={t('routes.organization.blocks.modal.edit-title')}
                        onClose={() => {
                            setVisibleModalId(null);
                            setShowAllTree(false);
                        }}
                    >
                        <TreeList
                            onSetChecked={setChecked}
                            defaultChecked={checked}
                            isLoading={isLoading}
                            items={visibleModalId === null ? cards : [cards[visibleModalId]]}
                            expandOpen={<IconExpand svg={{ className: cn('organization__expand-icon') }} />}
                            expandClose={<IconCollapse svg={{ className: cn('organization__expand-icon') }} />}
                            label={(props) => <CardItem {...props} />}
                        />
                    </Modal>
                )}
            </Wrapper>
        </SidebarLayout>
    );
};

export default Organization;
