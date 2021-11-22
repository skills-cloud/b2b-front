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

import { Request, NoName9 as TStatus, NoName5 as TPriority } from 'adapter/types/main/request/id/patch/code-200';
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
    customer: ISelect,
    project: ISelect,
    module: ISelect,
    type: ISelect,
    prioritySelect: {
        value: TPriority,
        label: string
    },
    statusSelect: {
        value: TStatus,
        label: string
    },
    resource_manager: ISelect,
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

    const [post, { isLoading: isLoadingPost }] = mainRequest.usePostMainRequestMutation();
    const [patch, { isLoading: isLoadingPatch }] = mainRequest.usePatchMainRequestMutation();
    const { data: accUsersData } = acc.useGetAccUserQuery(undefined);
    const { data: projectData } = mainRequest.useGetMainOrganizationProjectByIdQuery({ id: params.projectId }, { skip: !params.projectId });

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
            recruiter: defaultValues?.recruiter ? {
                value: String(defaultValues?.recruiter?.id),
                label: `${defaultValues?.recruiter?.last_name} ${defaultValues?.recruiter?.first_name}`
            } : undefined,
            resource_manager: defaultValues?.resource_manager ? {
                value: String(defaultValues?.resource_manager?.id),
                label: `${defaultValues?.resource_manager?.last_name} ${defaultValues?.resource_manager?.first_name}`
            } : undefined,
            industry_sector: defaultValues?.industry_sector ? {
                value: String(defaultValues?.industry_sector?.id),
                label: defaultValues?.industry_sector?.name
            } : undefined,
            customer: defaultValues?.module?.organization_project ? {
                value: String(defaultValues?.module.organization_project.organization_id),
                label: defaultValues?.module.organization_project.organization?.name
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
        form.setValue('period', defaultDates);
    }, [JSON.stringify(projectData)]);

    const onSubmit = form.handleSubmit(({
        period,
        industry_sector,
        project,
        module,
        customer,
        prioritySelect,
        statusSelect,
        type,
        resource_manager,
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

        if(resource_manager) {
            postData.resource_manager_id = parseInt(resource_manager.value, 10);
        }

        if(recruiter) {
            postData.recruiter_id = parseInt(recruiter.value, 10);
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
                isMulti={false}
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
                            isMulti={false}
                            requestType={InputMain.requestType.Customer}
                            name="customer"
                            direction="column"
                            label={t('routes.project-request.create.customer')}
                            required={errorMessage}
                            disabled={!!params.organizationId}
                        />
                        <InputProject
                            filters={{
                                organization_id: values.customer?.value ?? undefined
                            }}
                            name="project"
                            direction="column"
                            label={t('routes.project-request.create.project')}
                            disabled={!!params.projectId || !values.customer?.value}
                        />
                        {elInputModule()}
                        <InputDictionary
                            isMulti={false}
                            requestType={InputDictionary.requestType.IndustrySector}
                            name="industry_sector"
                            direction="column"
                            label={t('routes.project-request.create.industry_sector')}
                        />
                        <Select
                            name="recruiter"
                            direction="column"
                            label={t('routes.project-request.create.recruiter')}
                            options={options}
                        />
                        <div className={cn('project-request__field-group')}>
                            <Select
                                name="resource_manager"
                                direction="column"
                                label={t('routes.project-request.create.resource_manager')}
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
                            rows={6}
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
                </form>
            </FormProvider>
        </React.Fragment>
    );
};

export default ProjectsRequestForm;
