import React, { useState } from 'react';
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
import EditAction from 'component/section/actions/edit';

import { mainRequest } from 'adapter/api/main';
import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';
import EditModal from 'route/organizations/edit-modal';

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

    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);

    const isOrganizationAdmin = (orgId?: number) => {
        return whoAmIData?.organizations_contractors_roles?.some((orgRole) => {
            if(orgRole.organization_contractor_id && orgId) {
                return parseInt(orgRole.organization_contractor_id, 10) === orgId && orgRole.role === 'admin';
            }

            return false;
        });
    };

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const onClickClose = () => {
        setIsEdit(false);
    };

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

    const elEditModal = () => {
        if(data && isEdit) {
            return <EditModal setVisible={onClickClose} fields={data} />;
        }
    };

    const elCustomerContractor = () => {
        let text = '';

        if(data?.is_customer && !data?.is_contractor) {
            text = t('routes.organizations.main.list.customer');
        } else if(data?.is_contractor && !data?.is_customer) {
            text = t('routes.organizations.main.list.contractor');
        } else if(data?.is_customer && data?.is_contractor) {
            text = `${t('routes.organizations.main.list.customer')} • ${t('routes.organizations.main.list.contractor')}`;
        }

        if(data?.is_partner) {
            if(text) {
                text = `${text} • ${t('routes.organizations.main.list.partner')}`;
            } else {
                text = t('routes.organizations.main.list.partner');
            }
        }

        return (
            <div className={cn('organization__company')}>
                {text}
            </div>
        );
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
                        <div
                            className={cn('organization__title', {
                                'organization__title_edit': isOrganizationAdmin(data?.id) || whoAmIData?.is_superuser
                            })}
                        >
                            <SectionHeader>{data?.name}</SectionHeader>
                            {(isOrganizationAdmin(data?.id) || whoAmIData?.is_superuser) && (
                                <EditAction
                                    onClick={() => {
                                        setIsEdit(true);
                                    }}
                                />
                            )}
                        </div>
                        {elCustomerContractor()}
                        <div className={cn('organization__list-item-block', 'organization__list-item-block_row')}>
                            <span className={cn('organization__list-item-span')}>{t('routes.organization.description.title')}</span>
                            <p className={cn('organization__list-item-text')}>
                                {data?.description || t('routes.organization.description.empty')}
                            </p>
                        </div>
                        <div className={cn('organization__list-item-block', 'organization__list-item-block_row')}>
                            <span className={cn('organization__list-item-span')}>{t('routes.organizations.main.list.contact-person.title')}</span>
                            <p className={cn('organization__list-item-sub-head')}>{data?.contact_person || t('routes.organizations.main.list.contact-person.empty')}</p>
                            {(data?.contacts_phone || data?.contacts_email) && (
                                <p className={cn('organization__list-item-text')}>
                                    {`${data?.contacts_phone || ''}   ${data?.contacts_email || ''}`.trim()}
                                </p>
                            )}
                        </div>
                    </Wrapper>
                </Section>
                {data?.is_customer && <ProjectList isContractor={data?.is_contractor} isCustomer={data?.is_customer} />}
                {elProjectCards()}
            </Wrapper>
            {elEditModal()}
        </SidebarLayout>
    );
};

export default Organization;
