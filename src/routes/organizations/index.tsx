import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { Link } from 'react-router-dom';

import { ORGANIZATION_CREATE, ORGANIZATION_ID } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';

import FormInput from 'component/form/input';
import Loader from 'component/loader';
import { H3 } from 'component/header';
import Button from 'component/button';
import SectionHeader from 'component/section/header';
import Checkbox from 'component/form/checkbox';
import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import Wrapper from 'component/section/wrapper';
import AddAction from 'component/section/actions/add';
import Empty from 'component/empty';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DropdownMenuItem from 'component/dropdown/menu-item';
import DotsAction from 'component/section/actions/dots';
import EditAction from 'component/section/actions/edit';
import DeleteAction from 'component/section/actions/delete';

import { acc } from 'adapter/api/acc';
import { mainRequest } from 'adapter/api/main';
import { MainOrganization } from 'adapter/types/main/organization/get/code-200';

import ConfirmModal from './confirm-modal';
import EditModal from './edit-modal';
import style from './index.module.pcss';

export interface IFormValues {
    search?: string,
    is_customer?: boolean,
    is_contractor?: boolean,
    is_partner?: boolean
}

export const Organizations = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search, { parseBooleans: true }), [history.location.search]);
    const timer = useRef<ReturnType<typeof setTimeout>>();

    const context = useForm<IFormValues>({
        mode         : 'all',
        defaultValues: qs
    });
    const values = context.watch();
    const { data, isLoading } = mainRequest.useGetMainOrganizationQuery(normalizeObject(qs), { refetchOnMountOrArgChange: true });

    const [itemToEdit, setItemToEdit] = useState<MainOrganization>();
    const [itemToDelete, setItemToDelete] = useState<MainOrganization>();

    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);

    useEffect(() => {
        if(timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            history.push({
                search: stringify({
                    search: values.search,
                    ...(values.is_customer ? {
                        is_customer: values.is_customer
                    } : undefined),
                    ...(values.is_contractor ? {
                        is_contractor: values.is_contractor
                    } : undefined),
                    ...(values.is_partner ? {
                        is_partner: values.is_partner
                    } : undefined)
                }, {
                    skipEmptyString: true
                })
            });
        }, 300);

        return () => {
            if(timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [JSON.stringify(values)]);

    const onClearFilter = () => {
        context.reset({
            search       : '',
            is_contractor: false,
            is_customer  : false,
            is_partner   : false
        });
    };

    const onClickClose = () => {
        setItemToEdit(undefined);
        setItemToDelete(undefined);
    };

    const elCustomerContractor = (isCustomer?: boolean, isContractor?: boolean, isPartner?: boolean) => {
        let text = '';

        if(isCustomer && !isContractor) {
            text = t('routes.organizations.main.list.customer');
        } else if(isContractor && !isCustomer) {
            text = t('routes.organizations.main.list.contractor');
        } else if(isCustomer && isContractor) {
            text = `${t('routes.organizations.main.list.customer')} • ${t('routes.organizations.main.list.contractor')}`;
        }

        if(isPartner) {
            if(text) {
                text = `${text} • ${t('routes.organizations.main.list.partner')}`;
            } else {
                text = t('routes.organizations.main.list.partner');
            }
        }

        return text;
    };

    const isOrganizationAdmin = (orgId?: number) => {
        return whoAmIData?.organizations_contractors_roles?.some((orgRole) => {
            if(orgRole.organization_contractor_id && orgId) {
                return parseInt(orgRole.organization_contractor_id, 10) === orgId && orgRole.role === 'admin';
            }

            return false;
        });
    };

    const elOrganizations = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('organizations__list')}>
                    {data.results.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={cn('organizations__list-item', {
                                    'organizations__list-item_with-actions': isOrganizationAdmin(item.id) || whoAmIData?.is_superuser
                                })}
                            >
                                <div className={cn('organizations__list-item-content')}>
                                    <div className={cn('organizations__list-item-block')}>
                                        <Link to={ORGANIZATION_ID(item.id)} className={cn('organizations__list-item-link')}>
                                            {item.name}
                                        </Link>
                                        {elCustomerContractor(item.is_customer, item.is_contractor, item.is_partner)}
                                    </div>
                                    <div className={cn('organizations__list-item-block', 'organizations__list-item-block_row')}>
                                        <span className={cn('organizations__list-item-span')}>{t('routes.organizations.main.list.description.title')}</span>
                                        <p className={cn('organizations__list-item-text')}>
                                            {item.description || t('routes.organizations.main.list.description.empty')}
                                        </p>
                                    </div>
                                    <div className={cn('organizations__list-item-block', 'organizations__list-item-block_row')}>
                                        <span className={cn('organizations__list-item-span')}>{t('routes.organizations.main.list.contact-person.title')}</span>
                                        <p className={cn('organizations__list-item-sub-head')}>{item.contact_person || t('routes.organizations.main.list.contact-person.empty')}</p>
                                        {(item.contacts_phone || item.contacts_email) && (
                                            <p className={cn('organizations__list-item-text')}>
                                                {`${item.contacts_phone || ''}   ${item.contacts_email || ''}`.trim()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {(item.id && isOrganizationAdmin(item.id)) || whoAmIData?.is_superuser && (
                                    <div className={cn('organizations__list-item-actions')}>
                                        <Dropdown
                                            render={({ onClose }) => (
                                                <DropdownMenu>
                                                    <DropdownMenuItem selected={false} onClick={onClose}>
                                                        <EditAction
                                                            label={t('routes.organizations.main.controls.edit')}
                                                            onClick={() => {
                                                                setItemToEdit(item);
                                                                onClose();
                                                            }}
                                                        />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem selected={false} onClick={onClose}>
                                                        <DeleteAction
                                                            label={t('routes.organizations.main.controls.delete')}
                                                            onClick={() => {
                                                                setItemToDelete(item);
                                                                onClose();
                                                            }}
                                                        />
                                                    </DropdownMenuItem>
                                                </DropdownMenu>
                                            )}
                                        >
                                            <DotsAction />
                                        </Dropdown>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <Empty>{t('routes.organizations.main.list.empty')}</Empty>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading, whoAmIData?.is_superuser]);

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.organizations.sidebar.filters.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('organizations__form')}>
                            <Checkbox
                                name="is_customer"
                                label={t('routes.organizations.sidebar.filters.form.customer.label')}
                            />
                            <Checkbox
                                name="is_contractor"
                                label={t('routes.organizations.sidebar.filters.form.contractor.label')}
                            />
                            <Checkbox
                                name="is_partner"
                                label={t('routes.organizations.sidebar.filters.form.partner.label')}
                            />
                            <FormInput
                                name="search"
                                type="text"
                                label={t('routes.organizations.sidebar.filters.form.search.label')}
                                placeholder={t('routes.organizations.sidebar.filters.form.search.placeholder')}
                            />
                            <Button type="button" onClick={onClearFilter} isSecondary={true}>
                                {t('routes.organizations.sidebar.filters.buttons.clear')}
                            </Button>
                        </form>
                    </FormProvider>
                </Wrapper>
            </Section>
        );
    };

    const elEditModal = () => {
        if(itemToEdit) {
            return <EditModal setVisible={onClickClose} fields={itemToEdit} />;
        }
    };

    const elConfirmModal = () => {
        if(itemToDelete) {
            return (
                <ConfirmModal
                    setVisible={onClickClose}
                    organizationId={String(itemToDelete.id)}
                    organizationName={itemToDelete.name}
                />
            );
        }
    };

    const elActions = () => {
        if(whoAmIData?.is_superuser) {
            return <AddAction to={ORGANIZATION_CREATE} />;
        }
    };

    return (
        <SidebarLayout sidebar={elSidebar()}>
            <Section>
                <Wrapper>
                    <SectionHeader actions={elActions()}>
                        {t('routes.organizations.main.title')}
                    </SectionHeader>
                    {elOrganizations}
                    {elEditModal()}
                    {elConfirmModal()}
                </Wrapper>
            </Section>
        </SidebarLayout>
    );
};

export default Organizations;
