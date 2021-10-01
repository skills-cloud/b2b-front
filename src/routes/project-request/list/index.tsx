import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { parse, stringify } from 'query-string';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { useClassnames } from 'hook/use-classnames';
import { normalizeObject } from 'src/helper/normalize-object';

import InputSelect, { IValue } from 'component/form/select';
import Loader from 'component/loader';
import Button from 'component/button';
import IconPlus from 'component/icons/plus';
import InputDictionary from 'component/form/input-dictionary';
import InputMain from 'component/form/input-main';

import { mainRequest } from 'adapter/api/main';

import RequestList from 'component/request-list';
import style from './index.module.pcss';

export interface IDefaultValues {
    industry_sector?: IValue | null,
    priority?: IValue | null,
    status?: IValue | null,
    customer?: IValue | null,
    project?: IValue | null
}

const defaultValues: IDefaultValues = {
    industry_sector: null,
    priority       : null,
    status         : null,
    customer       : null,
    project        : null
};

const ProjectRequestList = () => {
    const cn = useClassnames(style);
    const history = useHistory();
    const { t, i18n } = useTranslation();

    const qs = useMemo(() => parse(history.location.search), [history.location.search]);

    const context = useForm({
        mode: 'all',
        defaultValues
    });

    const { data, isLoading, refetch } = mainRequest.useGetRequestListQuery(normalizeObject(qs));

    const onSubmit = context.handleSubmit(
        (formData) => {
            const objectToNormalize = {
                industry_sector_id: formData.industry_sector?.value,
                priority          : formData.priority?.value,
                status            : formData.status?.value,
                customer_id       : formData.customer?.value,
                project_id        : formData.project?.value
            };

            history.replace({
                search: stringify(normalizeObject(objectToNormalize))
            });
        },
        (formError) => {
            console.error(formError);
        }
    );

    useEffect(() => {
        refetch();
    }, [JSON.stringify(qs)]);

    const onClearFilter = () => {
        history.replace({
            search: ''
        });
        context.reset(defaultValues);
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

    return (
        <main className={cn('request-list')}>
            <section className={cn('request-list__main')}>
                <div className={cn('request-list__main-top')}>
                    <h2 className={cn('request-list__main-header')}>{t('routes.project-request-list.title')}</h2>
                    <Link
                        to="/project-request/create"
                        className={cn('request-list__main-button')}
                    >
                        <IconPlus />
                    </Link>
                </div>
                {elRequests}
            </section>
            <aside className={cn('request-list__search')}>
                <h3 className={cn('request-list__search-header')}>{t('routes.project-request-list.sidebar.filters.title')}</h3>
                <FormProvider {...context}>
                    <form
                        onSubmit={onSubmit}
                        className={cn('request-list__form')}
                    >
                        <InputDictionary
                            requestType={InputDictionary.requestType.IndustrySector}
                            defaultValue={[qs.industry_sector as string]}
                            name="industry_sector"
                            direction="column"
                            clearable={true}
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
                        <InputMain
                            isMulti={false}
                            requestType={InputMain.requestType.Customer}
                            defaultValue={[qs.customer as string]}
                            name="customer"
                            direction="column"
                            clearable={true}
                            label={t('routes.project-request-list.sidebar.filters.customer.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.customer.placeholder')}
                        />
                        <InputMain
                            isMulti={false}
                            requestType={InputMain.requestType.Project}
                            defaultValue={[qs.project as string]}
                            name="project"
                            direction="column"
                            clearable={true}
                            label={t('routes.project-request-list.sidebar.filters.project.label')}
                            placeholder={t('routes.project-request-list.sidebar.filters.project.placeholder')}
                        />
                        <Button type="submit">
                            {t('routes.project-request-list.sidebar.filters.buttons.submit')}
                        </Button>
                        <Button type="button" onClick={onClearFilter} isSecondary={true}>
                            {t('routes.project-request-list.sidebar.filters.buttons.clear')}
                        </Button>
                    </form>
                </FormProvider>
            </aside>
        </main>
    );
};

export default ProjectRequestList;
