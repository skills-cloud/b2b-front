import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { useHistory, useParams } from 'react-router';

import { IParams, REQUEST_CREATE } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';
import useRoles from 'hook/use-roles';

import InputSelect, { IValue } from 'component/form/select';
import Loader from 'component/loader';
import Button from 'component/button';
import AddAction from 'component/section/actions/add';
import InputDictionary from 'component/form/input-dictionary';
import InputMain from 'component/form/input-main';
import { H3 } from 'component/header';
import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import SectionHeader from 'component/section/header';
import Wrapper from 'component/section/wrapper';

import { mainRequest } from 'adapter/api/main';

import RequestList from 'component/request-list';
import style from './index.module.pcss';
import { acc } from 'adapter/api/acc';

export interface IFormPayload {
    industry_sector?: Array<IValue>,
    priority?: IValue | null,
    status?: IValue | null,
    organization_customer?: Array<IValue> | null,
    organization_project?: Array<IValue> | null
}

const ProjectRequestList = () => {
    const cn = useClassnames(style);
    const { organizationId } = useParams<IParams>();
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const { data: whoAmIData } = acc.useGetAccWhoAmIQuery(undefined);
    const alternativeOrgId = whoAmIData?.organizations_contractors_roles?.find((item) => item.organization_contractor_id);
    const { su, pfm, pm, admin } = useRoles(organizationId || alternativeOrgId?.organization_contractor_id);

    const PRIORITY_SUGGESTS = useMemo(() => [{
        value: '30',
        label: t('routes.project-request-list.sidebar.filters.priority.value.30')
    }, {
        value: '20',
        label: t('routes.project-request-list.sidebar.filters.priority.value.20')
    }, {
        value: '10',
        label: t('routes.project-request-list.sidebar.filters.priority.value.10')
    }], []);

    const STATUSES_SUGGESTS = useMemo(() => [{
        value: 'draft',
        label: t('routes.project-request-list.sidebar.filters.status.value.draft')
    }, {
        value: 'in_progress',
        label: t('routes.project-request-list.sidebar.filters.status.value.in_progress')
    }, {
        value: 'done',
        label: t('routes.project-request-list.sidebar.filters.status.value.done')
    }, {
        value: 'closed',
        label: t('routes.project-request-list.sidebar.filters.status.value.closed')
    }], []);

    const timer = useRef<ReturnType<typeof setTimeout>>();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);
    const context = useForm<IFormPayload>({
        mode         : 'all',
        defaultValues: {
            priority: PRIORITY_SUGGESTS.find((item) => item.value === qs.priority),
            status  : STATUSES_SUGGESTS.find((item) => item.value === qs.status)
        }
    });
    const values = context.watch();
    const { data, isLoading } = mainRequest.useGetMainRequestQuery(normalizeObject(qs));

    useEffect(() => {
        if(timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            const filters = {
                ...(values.industry_sector ? { industry_sector_id: values.industry_sector?.map((item) => item?.value || '') } : {}),
                ...(values.organization_customer ? { organization_customer_id: values.organization_customer?.map((item) => item?.value) } : {}),
                ...(values.organization_project ? { organization_project_id: values.organization_project?.map((item) => item?.value) } : {}),
                priority: values.priority?.value,
                status  : values.status?.value
            };

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
            organization_customer: [],
            organization_project : [],
            priority             : null,
            status               : null
        });
    };

    const elRequests = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return <RequestList requestList={data.results} />;
        }

        return <span className={cn('request-list__requests-empty')}>{t('routes.project-request-list.requests.empty')}</span>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading]);

    const elSidebar = () => {
        return (
            <Section>
                <Wrapper>
                    <H3>{t('routes.project-request-list.sidebar.filters.title')}</H3>
                    <FormProvider {...context}>
                        <form className={cn('request-list__form')}>
                            <InputDictionary
                                requestType={InputDictionary.requestType.IndustrySector}
                                defaultValue={Array.isArray(qs.industry_sector_id) ? qs.industry_sector_id : [qs.industry_sector_id as string]}
                                name="industry_sector"
                                direction="column"
                                clearable={true}
                                label={t('routes.project-request-list.sidebar.filters.industry-sector.label')}
                                placeholder={t('routes.project-request-list.sidebar.filters.industry-sector.placeholder')}
                            />
                            <InputSelect
                                name="priority"
                                direction="column"
                                clearable={true}
                                label={t('routes.project-request-list.sidebar.filters.priority.label')}
                                placeholder={t('routes.project-request-list.sidebar.filters.priority.placeholder')}
                                options={PRIORITY_SUGGESTS}
                            />
                            <InputSelect
                                name="status"
                                direction="column"
                                clearable={true}
                                label={t('routes.project-request-list.sidebar.filters.status.label')}
                                placeholder={t('routes.project-request-list.sidebar.filters.status.placeholder')}
                                options={STATUSES_SUGGESTS}
                            />
                            <InputMain
                                isMulti={true}
                                requestType={InputMain.requestType.Customer}
                                defaultValue={[qs.customer_id as string]}
                                name="organization_customer"
                                direction="column"
                                clearable={true}
                                label={t('routes.project-request-list.sidebar.filters.customer.label')}
                                placeholder={t('routes.project-request-list.sidebar.filters.customer.placeholder')}
                            />
                            <InputMain
                                isMulti={true}
                                requestType={InputMain.requestType.Project}
                                defaultValue={[qs.project_id as string]}
                                name="organization_project"
                                direction="column"
                                clearable={true}
                                label={t('routes.project-request-list.sidebar.filters.project.label')}
                                placeholder={t('routes.project-request-list.sidebar.filters.project.placeholder')}
                            />
                            <Button type="button" onClick={onClearFilter} isSecondary={true}>
                                {t('routes.project-request-list.sidebar.filters.buttons.clear')}
                            </Button>
                        </form>
                    </FormProvider>
                </Wrapper>
            </Section>
        );
    };

    const elActions = () => {
        if(su || admin || pfm || pm) {
            return <AddAction to={REQUEST_CREATE} />;
        }
    };

    return (
        <SidebarLayout sidebar={elSidebar()}>
            <Section>
                <SectionHeader actions={elActions()}>
                    {t('routes.project-request-list.title')}
                </SectionHeader>
                {elRequests}
            </Section>
        </SidebarLayout>
    );
};

export default ProjectRequestList;
