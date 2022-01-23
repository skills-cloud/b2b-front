import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import Select, { IValue } from 'component/form/select';
import Textarea from 'component/form/textarea';
import DeadlineDates from 'component/form/deadline-dates';
import Tabs, { Tab } from 'component/tabs';
import InputDictionary from 'component/form/input-dictionary';
import InputMain from 'component/form/input-main';
import InputProject from 'component/form/input-project';
import Input from 'component/form/input';
import InputModule from 'component/form/input-module';
import ErrorsComponent from 'component/error/errors';

import { Request, NoName7 as TStatus, NoName5 as TPriority } from 'adapter/types/main/request/id/patch/code-200';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import { mainRequest } from 'src/adapters/api/main';
import { acc } from 'src/adapters/api/acc';

import style from './index.module.pcss';

interface ISelect {
    value: string,
    label: string
}

interface IFormValues {
    industry_sector: ISelect,
    organization_customer: ISelect,
    project: ISelect,
    module: ISelect,
    organization_contractor: ISelect,
    type: ISelect,
    prioritySelect: {
        value: TPriority,
        label: string
    },
    statusSelect: {
        value: TStatus,
        label: string
    },
    manager_rm: ISelect,
    manager_pm: string,
    recruiter: ISelect,
    period: {
        start_date: string | undefined,
        deadline_date: string | undefined
    }
}

interface IProjectsRequestForm {
    formId: string,
    onSuccess: (id: number) => void,
    setIsLoading?: (isLoading: boolean) => void,
    defaultValues?: RequestRead
}

enum ETabs {
    Main,
    ProjectTiming
}

const statusInvariants = ['closed', 'done', 'draft', 'in_progress'];
const priorityInvariants = ['10', '20', '30'];

const ProjectsRequestForm = ({ formId, onSuccess, defaultValues, setIsLoading }: IProjectsRequestForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const params = useParams<IParams>();

    const [projectId, setProjectId] = useState<string>('');

    const [post, { isLoading: isLoadingPost, isError, error }] = mainRequest.usePostMainRequestMutation();
    const [patch, { isLoading: isLoadingPatch, isError: isPatchError, error: patchError }] = mainRequest.usePatchMainRequestMutation();
    const { data: projectData, refetch } = mainRequest.useGetMainOrganizationProjectByIdQuery({
        id: params.projectId || projectId
    }, {
        skip                     : !params.projectId && !projectId,
        refetchOnMountOrArgChange: true
    });
    const { data: accUsersData } = acc.useGetAccUserQuery({
        role                      : ['rm'],
        organization_contractor_id: [projectData?.organization_contractor_id as number]
    }, {
        skip: !projectData?.organization_contractor_id
    });

    const [activeTab, setActiveTab] = useState<ETabs>(ETabs.Main);
    const [options, setOptions] = useState<Array<IValue>>([]);

    useEffect(() => {
        setIsLoading?.(isLoadingPatch || isLoadingPost);
    }, [isLoadingPatch, isLoadingPost]);

    useEffect(() => {
        if(accUsersData?.results) {
            const newOptions = accUsersData?.results?.map((item) => ({
                label: `${item.last_name} ${item.first_name}`.trim(),
                value: String(item.id)
            }));

            setOptions(newOptions);
        }
    }, [JSON.stringify(accUsersData?.results)]);

    const startDate = defaultValues?.deadline_date || projectData?.date_from;
    const deadlineDate = defaultValues?.deadline_date || projectData?.date_to;
    const defaultDates = startDate && deadlineDate ? {
        start_date   : startDate,
        deadline_date: deadlineDate
    } : {
        start_date   : undefined,
        deadline_date: undefined
    };

    const form = useForm<IFormValues>({
        defaultValues: {
            ...defaultValues,
            manager_rm: defaultValues?.manager_rm ? {
                value: String(defaultValues?.manager_rm?.id),
                label: `${defaultValues?.manager_rm?.last_name} ${defaultValues?.manager_rm?.first_name}`
            } : undefined,
            industry_sector: defaultValues?.industry_sector ? {
                value: String(defaultValues?.industry_sector?.id),
                label: defaultValues?.industry_sector?.name
            } : undefined,
            organization_customer: defaultValues?.module?.organization_project ? {
                value: String(defaultValues?.module.organization_project.organization_customer_id),
                label: defaultValues?.module.organization_project.organization_customer?.name
            } : undefined,
            organization_contractor: defaultValues?.module?.organization_project ? {
                value: String(defaultValues?.module.organization_project.organization_contractor_id),
                label: defaultValues?.module.organization_project.organization_contractor?.name
            } : undefined,
            project: defaultValues?.module?.organization_project ? {
                value: String(defaultValues?.module.organization_project?.id),
                label: defaultValues?.module.organization_project?.name
            } : undefined,
            module: defaultValues?.module ? {
                value: String(defaultValues?.module?.id),
                label: defaultValues?.module.name
            } : undefined,
            type: defaultValues?.type ? {
                value: String(defaultValues?.type?.id),
                label: defaultValues?.type?.name
            } : undefined,
            prioritySelect: defaultValues?.priority ? {
                value: defaultValues?.priority,
                label: t(`routes.project-request.create.priority.${defaultValues?.priority}`)
            } : undefined,
            statusSelect: defaultValues?.status ? {
                value: defaultValues?.status,
                label: t(`routes.project-request.create.status.${defaultValues?.status}`)
            } : undefined,
            period: defaultDates
        }
    });

    const values = form.watch();

    useEffect(() => {
        if(values.project?.value) {
            setProjectId(values.project?.value);
        }
    }, [values.project?.value]);

    useEffect(() => {
        const projectDataOrgId = projectData?.organization_customer_id;
        const valuesOrgId = parseInt(values.organization_customer?.value, 10);

        if(projectDataOrgId !== valuesOrgId || valuesOrgId !== defaultValues?.module?.organization_project?.organization_customer_id) {
            refetch();
        }
    }, [JSON.stringify(values.organization_customer)]);

    useEffect(() => {
        form.setValue('period', defaultDates);

        if(projectData?.manager_pm?.last_name || projectData?.manager_pm?.first_name) {
            let name = projectData.manager_pm.last_name || '';

            if(projectData.manager_pm.first_name) {
                name = `${name} ${projectData.manager_pm.first_name.substring(0, 1).toUpperCase()}.`;
            }

            form.setValue('manager_pm', name);
        }
    }, [JSON.stringify(projectData)]);

    const onSubmit = form.handleSubmit(({
        period,
        industry_sector,
        project,
        module,
        organization_customer,
        prioritySelect,
        statusSelect,
        type,
        manager_rm,
        recruiter,
        ...data
    }) => {
        const postData: Partial<Request> = {
            ...data,
            ...period
        };

        if(industry_sector) {
            postData.industry_sector_id = parseInt(industry_sector.value, 10);
        }

        if(module) {
            postData.module_id = parseInt(module.value, 10);
        }

        if(prioritySelect) {
            postData.priority = prioritySelect.value;
        }

        if(statusSelect) {
            postData.status = statusSelect.value;
        }

        if(type) {
            postData.type_id = parseInt(type.value, 10);
        }

        if(manager_rm) {
            postData.manager_rm_id = parseInt(manager_rm.value, 10);
        }

        const formData = Object.fromEntries(Object.entries(postData).filter(([, value]) => (!!value)));
        const method = defaultValues ? patch : post;
        const { id: requestId, ...rest } = formData;

        const request = method({
            ...rest,
            organization_project_id: parseInt(project.value, 10),
            id                     : requestId as number || parseInt(params.requestId, 10)
        });

        request
            .unwrap()
            .then((response) => {
                const id = response.id;

                if(id) {
                    onSuccess(id);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    });

    const errorMessage = t('routes.project-request.create.required-error');

    const elInputModule = () => {
        const filters = {
            organization_project_id: values.project?.value ? [parseInt(values.project?.value, 10)] : undefined
        };

        return (
            <InputModule
                defaultValue={params.moduleId}
                isMulti={false}
                required={true}
                filters={filters}
                name="module"
                direction="column"
                label={t('routes.project-request.create.module')}
                disabled={!!params.moduleId || !values.project?.value}
            />
        );
    };

    return (
        <React.Fragment>
            <Tabs>
                <Tab
                    active={activeTab === ETabs.Main}
                    onClick={() => {
                        setActiveTab(ETabs.Main);
                    }}
                >
                    {t('routes.project-request.create.tabs.main')}
                </Tab>
                <Tab
                    active={activeTab === ETabs.ProjectTiming}
                    onClick={() => {
                        setActiveTab(ETabs.ProjectTiming);
                    }}
                >
                    {t('routes.project-request.create.tabs.project-timing')}
                </Tab>
            </Tabs>
            <FormProvider {...form}>
                <form method="POST" id={formId} onSubmit={onSubmit}>
                    <div className={cn('project-request__form', { 'project-request__form_hide': activeTab === ETabs.ProjectTiming })}>
                        <Input
                            type="text"
                            name="title"
                            label={t('routes.project-request.create.form-title')}
                        />
                        <InputMain
                            defaultValue={[params.organizationId || projectData?.organization_customer_id as number]}
                            isMulti={false}
                            requestType={InputMain.requestType.Customer}
                            name="organization_customer"
                            direction="column"
                            label={t('routes.project-request.create.customer')}
                            required={errorMessage}
                            disabled={!!defaultValues || !!params.organizationId}
                        />
                        <InputProject
                            defaultValue={params.projectId}
                            filters={{
                                organization_customer_id: values.organization_customer?.value ? [parseInt(values.organization_customer?.value, 10)] : undefined
                            }}
                            name="project"
                            direction="column"
                            label={t('routes.project-request.create.project')}
                            disabled={!!params.projectId || !values.organization_customer?.value}
                        />
                        {projectData?.organization_contractor_id && (
                            <InputMain
                                defaultValue={[projectData?.organization_contractor_id]}
                                requestType={InputMain.requestType.Contractor}
                                name="organization_contractor"
                                direction="column"
                                label={t('routes.project-request.create.contractor')}
                                disabled={true}
                                isMulti={false}
                            />
                        )}
                        {projectData?.manager_pm && (
                            <Input
                                type="text"
                                disabled={true}
                                name="manager_pm"
                                label={t('routes.project-request.create.manager_pm')}
                            />
                        )}
                        {elInputModule()}
                        <InputDictionary
                            isMulti={false}
                            requestType={InputDictionary.requestType.IndustrySector}
                            name="industry_sector"
                            direction="column"
                            label={t('routes.project-request.create.industry_sector')}
                        />
                        <div className={cn('project-request__field-group')}>
                            <Select
                                name="manager_rm"
                                direction="column"
                                label={t('routes.project-request.create.manager_rm')}
                                options={options}
                            />
                            <InputMain
                                isMulti={false}
                                requestType={InputMain.requestType.RequestType}
                                name="type"
                                direction="column"
                                label={t('routes.project-request.create.type')}
                            />
                        </div>
                        <div className={cn('project-request__field-group')}>
                            <Select
                                name="prioritySelect"
                                label={t('routes.project-request.create.priority.title')}
                                direction="column"
                                options={priorityInvariants.map((priority) => ({
                                    label: t(`routes.project-request.create.priority.${priority}`),
                                    value: priority
                                }))}
                            />
                            <Select
                                name="statusSelect"
                                label={t('routes.project-request.create.status.title')}
                                direction="column"
                                options={statusInvariants.map((status) => ({
                                    label: t(`routes.project-request.create.status.${status}`),
                                    value: status
                                }))}
                            />
                        </div>
                        <Textarea
                            name="description"
                            label={t('routes.project-request.create.description')}
                        />
                    </div>
                    <div className={cn('project-request__form', { 'project-request__form_hide': activeTab === ETabs.Main })}>
                        <DeadlineDates
                            nameDateFrom="period.start_date"
                            nameDateTo="period.deadline_date"
                            labels={{
                                dateFrom: t('routes.project-request.create.period-form.date_from'),
                                dateTo  : t('routes.project-request.create.period-form.date_to')
                            }}
                            defaultValues={{
                                dateFrom: projectData?.date_from,
                                dateTo  : projectData?.date_to
                            }}
                        />
                        {/* TODO Добавить блок приостановки проекта, как будет готов бек */}
                        {/* <a
                            href="#append"
                            className={cn('project-request__append')}
                            onClick={(event) => {
                                event.preventDefault();
                                append({});
                            }}
                        >{t('routes.project-request.create.period-form.add')}
                        </a> */}
                    </div>
                    <ErrorsComponent
                        error={error || patchError}
                        isError={isError || isPatchError}
                        isLoading={isLoadingPatch || isLoadingPost}
                    />
                </form>
            </FormProvider>
        </React.Fragment>
    );
};

export default ProjectsRequestForm;
