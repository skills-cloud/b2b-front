import React, { useMemo, useEffect, useRef, useState, ReactNode } from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { Link } from 'react-router-dom';

import { ORGANIZATION_PROJECT_ID, PROJECTS_CREATE } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';

import Loader from 'component/loader';
import { H3 } from 'component/header';
import Button from 'component/button';
import SectionHeader from 'component/section/header';
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
import SectionContentListItem from 'component/section/content-list-item';
import Timeframe from 'component/timeframe';
import InputDictionary from 'component/form/input-dictionary';
import InputMain from 'component/form/input-main';
import { IValue } from 'component/form/select';

import { acc } from 'adapter/api/acc';
import { mainRequest } from 'adapter/api/main';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';

import ConfirmModal from './confirm-modal';
import EditModal from './edit-modal';
import style from './index.module.pcss';

export interface IFormValues {
    industry_sector?: Array<IValue> | null,
    organization_customer?: Array<IValue> | null
}

export const Projects = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const timer = useRef<ReturnType<typeof setTimeout>>();

    const context = useForm<IFormValues>({
        mode         : 'all',
        defaultValues: qs
    });
    const values = context.watch();
    const { data, isLoading } = mainRequest.useGetMainOrganizationProjectListQuery(normalizeObject(qs), { refetchOnMountOrArgChange: true });

    const [itemToEdit, setItemToEdit] = useState<OrganizationProjectRead>();
    const [itemToDelete, setItemToDelete] = useState<OrganizationProjectRead>();

    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);

    useEffect(() => {
        if(timer.current) {
            clearTimeout(timer.current);
        }

        const filters = {
            ...(values.industry_sector ? { industry_sector_id: values.industry_sector?.map((item) => item?.value) } : {}),
            ...(values.organization_customer ? { organization_customer_id: values.organization_customer?.map((item) => item?.value) } : {})
        };

        timer.current = setTimeout(() => {
            history.push({
                search: stringify(filters, {
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
            industry_sector      : [],
            organization_customer: []
        });
    };

    const onClickClose = () => {
        setItemToEdit(undefined);
        setItemToDelete(undefined);
    };

    const isOrganizationAdmin = (orgId?: number) => {
        return whoAmIData?.organizations_contractors_roles?.some((orgRole) => {
            if(orgRole.organization_contractor_id && orgId) {
                return parseInt(orgRole.organization_contractor_id, 10) === orgId && orgRole.role === 'admin';
            }

            return false;
        });
    };

    const elTimeframe = (dateFrom?: string, dateTo?: string) => {
        let content: ReactNode = t('routes.projects.project-item.blocks.empty');

        if(dateFrom || dateTo) {
            content = <Timeframe startDate={dateFrom} endDate={dateTo} />;
        }

        return (
            <SectionContentListItem title={t('routes.projects.project-item.blocks.timeframe')}>
                {content}
            </SectionContentListItem>
        );
    };

    const elProjects = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('projects__list')}>
                    {data.results.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={cn('projects__list-item', {
                                    'projects__list-item_with-actions': isOrganizationAdmin(item.id) || whoAmIData?.is_superuser
                                })}
                            >
                                <div className={cn('projects__list-item-content')}>
                                    <div className={cn('projects__list-item-block')}>
                                        <Link to={ORGANIZATION_PROJECT_ID(undefined, item.id)} className={cn('projects__list-item-link')}>
                                            {item.name}
                                        </Link>
                                    </div>
                                </div>
                                {(item.id && isOrganizationAdmin(item.id)) || whoAmIData?.is_superuser && (
                                    <div className={cn('projects__list-item-actions')}>
                                        <Dropdown
                                            render={({ onClose }) => (
                                                <DropdownMenu>
                                                    <DropdownMenuItem selected={false} onClick={onClose}>
                                                        <EditAction
                                                            label={t('routes.projects.main.controls.edit')}
                                                            onClick={() => {
                                                                setItemToEdit(item);
                                                                onClose();
                                                            }}
                                                        />
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem selected={false} onClick={onClose}>
                                                        <DeleteAction
                                                            label={t('routes.projects.main.controls.delete')}
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
                                <div className={cn('projects__content-list')}>
                                    <SectionContentListItem title={t('routes.projects.project-item.blocks.customer')}>
                                        {item.organization_customer?.name}
                                    </SectionContentListItem>
                                    {elTimeframe(item.date_from, item.date_to)}
                                    <SectionContentListItem title={t('routes.projects.project-item.blocks.industry_sector')}>
                                        {item.industry_sector?.name}
                                    </SectionContentListItem>
                                    <SectionContentListItem title={t('routes.projects.project-item.blocks.description')}>
                                        {item.description}
                                    </SectionContentListItem>
                                    <SectionContentListItem title={t('routes.projects.project-item.blocks.requests')}>
                                        {item.plan_description}
                                    </SectionContentListItem>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return <Empty>{t('routes.projects.main.list.empty')}</Empty>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading, whoAmIData?.is_superuser]);

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.projects.sidebar.filters.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('projects__form')}>
                            <InputMain
                                isMulti={true}
                                requestType={InputMain.requestType.Customer}
                                defaultValue={[qs.customer_id as string]}
                                name="organization_customer"
                                direction="column"
                                clearable={true}
                                label={t('routes.projects.sidebar.filters.form.customer.label')}
                            />
                            <InputDictionary
                                requestType={InputDictionary.requestType.IndustrySector}
                                defaultValue={Array.isArray(qs.industry_sector_id) ? qs.industry_sector_id : [qs.industry_sector_id as string]}
                                name="industry_sector"
                                direction="column"
                                clearable={true}
                                label={t('routes.projects.sidebar.filters.form.industry-sector.label')}
                            />
                            <Button type="button" onClick={onClearFilter} isSecondary={true}>
                                {t('routes.projects.sidebar.filters.buttons.clear')}
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
                    projectId={String(itemToDelete.id)}
                    projectName={itemToDelete.name}
                />
            );
        }
    };

    const elActions = () => {
        if(whoAmIData?.is_superuser) {
            return <AddAction to={PROJECTS_CREATE} />;
        }
    };

    return (
        <SidebarLayout sidebar={elSidebar()}>
            <Section>
                <Wrapper>
                    <SectionHeader actions={elActions()}>
                        {t('routes.projects.main.title')}
                    </SectionHeader>
                    {elProjects}
                    {elEditModal()}
                    {elConfirmModal()}
                </Wrapper>
            </Section>
        </SidebarLayout>
    );
};

export default Projects;
