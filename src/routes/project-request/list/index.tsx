import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { useHistory } from 'react-router';
import debounce from 'lodash.debounce';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

import { useClassnames } from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';
import { useDispatch } from 'component/core/store';

import FormInput from 'component/form/input';
import InputSelect from 'component/form/select';
import Loader from 'component/loader';

import { mainRequest } from 'adapter/api/main';
import { RequestRead } from 'adapter/types/main/request/get/code-200';

import style from './index.module.pcss';

const ProjectRequestList = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const context = useForm({
        mode: 'all'
    });

    const { data, isLoading } = mainRequest.useGetRequestListQuery(normalizeObject(qs));

    const onChangeFilters = () => {
        const formData = context.getValues();
        const objectToNormalize = {
            ...qs,
            industry_sector_id: formData.industry_sector,
            priority          : formData.priority?.value,
            status            : formData.status?.value,
            customer_id       : formData.customer?.value,
            project_id        : formData.project?.value
        };

        const isReplace = Object.values(objectToNormalize).some((item) => {
            if(Array.isArray(item)) {
                return item?.length > 0;
            }

            return !!item;
        });

        history.replace({
            search: isReplace ? stringify(normalizeObject(objectToNormalize)) : ''
        });
    };

    const onLoadOrganization = debounce((search: string, callback) => {
        dispatch(mainRequest.endpoints.getMainOrganization.initiate({ search, is_customer: 'true' }))
            .then(({ data: organizationData }) => {
                if(organizationData?.results?.length) {
                    callback(organizationData.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    })));
                } else {
                    callback(null);
                }
            })
            .catch(console.error);
    }, 150);

    const onLoadOrganizationProject = debounce((search: string, callback) => {
        dispatch(mainRequest.endpoints.getMainProject.initiate({ search }))
            .then(({ data: organizationData }) => {
                if(organizationData?.results?.length) {
                    callback(organizationData.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    })));
                } else {
                    callback(null);
                }
            })
            .catch(console.error);
    }, 150);

    useEffect(() => {
        onChangeFilters();
    }, [JSON.stringify(context.getValues())]);

    const elRequestItem = (requestItem: RequestRead) => {
        return (
            <div key={requestItem.id} className={cn('request-list__request')}>
                <div className={cn('request-list__request-top')}>
                    <div className={cn('request-list__request-top-left')}>
                        <Link to={`/project-request/${requestItem.id}`} className={cn('request-list__request-top-left-title')}>
                            {requestItem.project?.name || t('routes.project-request-list.requests.request-item.title')}
                        </Link>
                        <span className={cn('request-list__request-top-left-subtitle')}>
                            {t('routes.project-request-list.requests.request-item.date', {
                                date: format(new Date(requestItem.start_date as string), 'dd.MM.yyyy')
                            })}
                        </span>
                    </div>
                    <div className={cn('request-list__request-top-right')}>
                        <div className={cn('request-list__request-top-right-status')}>
                            {t(`routes.project-request-list.requests.request-item.status.value.${requestItem.status}`)}
                        </div>
                        <div
                            className={cn('request-list__request-top-right-priority', `request-list__request-top-right-priority_${requestItem.priority}`)}
                        >
                            {t(`routes.project-request-list.requests.request-item.priority.value.${requestItem.priority}`)}
                        </div>
                    </div>
                </div>
                <div className={cn('request-list__request-content')}>
                    <div className={cn('request-list__request-content-block')}>
                        <h5 className={cn('request-list__request-content-block-title')}>
                            {t('routes.project-request-list.requests.content.creator')}
                        </h5>
                        <p className={cn('request-list__request-content-block-text')}>
                            {requestItem.recruiter?.last_name || t('routes.project-request-list.requests.content.empty')}
                        </p>
                    </div>
                    <div className={cn('request-list__request-content-block')}>
                        <h5 className={cn('request-list__request-content-block-title')}>
                            {t('routes.project-request-list.requests.content.resource-manager')}
                        </h5>
                        <p className={cn('request-list__request-content-block-text')}>
                            {requestItem.resource_manager?.last_name || t('routes.project-request-list.requests.content.empty')}
                        </p>
                    </div>
                    <div className={cn('request-list__request-content-block')}>
                        <h5 className={cn('request-list__request-content-block-title')}>
                            {t('routes.project-request-list.requests.content.industry-sector')}
                        </h5>
                        <p className={cn('request-list__request-content-block-text')}>
                            {requestItem.industry_sector?.name || t('routes.project-request-list.requests.content.empty')}
                        </p>
                    </div>
                    <div className={cn('request-list__request-content-block')}>
                        <h5 className={cn('request-list__request-content-block-title')}>
                            {t('routes.project-request-list.requests.content.count.title')}
                        </h5>
                        <p className={cn('request-list__request-content-block-text')}>
                            {requestItem.requirements_count_sum ? t('routes.project-request-list.requests.content.count.value', { count: requestItem.requirements_count_sum }) : t('routes.project-request-list.requests.content.empty')}
                        </p>
                    </div>
                    <div className={cn('request-list__request-content-block')}>
                        <h5 className={cn('request-list__request-content-block-title')}>
                            {t('routes.project-request-list.requests.content.rate.title')}
                        </h5>
                        <p className={cn('request-list__request-content-block-text')}>
                            {requestItem.requirements?.[0]?.max_price ? t('routes.project-request-list.requests.content.rate.value', { count: requestItem.requirements?.[0]?.max_price }) : t('routes.project-request-list.requests.content.empty')}
                        </p>
                    </div>
                    <div className={cn('request-list__request-content-block')}>
                        <h5 className={cn('request-list__request-content-block-title')}>
                            {t('routes.project-request-list.requests.content.candidates.title')}
                        </h5>
                        <p className={cn('request-list__request-content-block-text')}>
                            {t('routes.project-request-list.requests.content.empty')}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const elRequests = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.results?.length) {
            return (
                <div className={cn('request-list__requests')}>
                    {data.results.map((requestItem) => elRequestItem(requestItem))}
                </div>
            );
        }

        return <span className={cn('request-list__requests-empty')}>{t('routes.project-request-list.requests.empty')}</span>;
    }, [JSON.stringify(data?.results), i18n.language, isLoading]);

    return (
        <main className={cn('request-list')}>
            <section className={cn('request-list__main')}>
                <h2 className={cn('request-list__main-header')}>{t('routes.project-request-list.title')}</h2>
                {elRequests}
            </section>
            <aside className={cn('request-list__search')}>
                <h3 className={cn('request-list__search-header')}>{t('routes.project-request-list.sidebar.filters.title')}</h3>
                <FormProvider {...context}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                        className={cn('request-list__form')}
                    >
                        <FormInput
                            name="industry_sector"
                            type="text"
                            label={t('routes.project-request-list.sidebar.filters.industry-sector.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.industry-sector.placeholder')}
                        />
                        <InputSelect
                            defaultValue={[qs.priority as string]}
                            name="priority"
                            direction="column"
                            clearable={true}
                            label={t('routes.project-request-list.sidebar.filters.priority.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.priority.placeholder')}
                            options={[{
                                value: '30',
                                label: t('routes.project-request-list.sidebar.filters.priority.value.30')
                            }, {
                                value: '20',
                                label: t('routes.project-request-list.sidebar.filters.priority.value.20')
                            }, {
                                value: '10',
                                label: t('routes.project-request-list.sidebar.filters.priority.value.10')
                            }]}
                        />
                        <InputSelect
                            defaultValue={[qs.status as string]}
                            name="status"
                            direction="column"
                            clearable={true}
                            label={t('routes.project-request-list.sidebar.filters.status.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.status.placeholder')}
                            options={[{
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
                                label: t('routes.project-request-list.sidebar.filters.status.value.done')
                            }]}
                        />
                        <InputSelect
                            defaultValue={[qs.customer as string]}
                            name="customer"
                            direction="column"
                            clearable={true}
                            label={t('routes.project-request-list.sidebar.filters.customer.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.customer.placeholder')}
                            loadOptions={onLoadOrganization}
                        />
                        <InputSelect
                            defaultValue={[qs.project as string]}
                            name="project"
                            direction="column"
                            clearable={true}
                            label={t('routes.project-request-list.sidebar.filters.project.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.project.placeholder')}
                            loadOptions={onLoadOrganizationProject}
                        />
                    </form>
                </FormProvider>
            </aside>
        </main>
    );
};

export default ProjectRequestList;
