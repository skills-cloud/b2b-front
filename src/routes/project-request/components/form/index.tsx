import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';
import { useClassnames } from 'hook/use-classnames';
import { useParams } from 'react-router';

import Select, { IValue } from 'component/form/select';
import Textarea from 'component/form/textarea';
import DeadlineDates from 'component/form/deadline-dates';
import Tabs, { Tab } from 'component/tabs';
import InputDictionary from 'component/form/input-dictionary';
import InputMain from 'component/form/input-main';
import InputProject from 'component/form/input-project';
import Input from 'component/form/input';

import { Request, NoName4, NoName2 } from 'adapter/types/main/request/id/patch/code-200';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import { mainRequest } from 'src/adapters/api/main';
import { acc } from 'src/adapters/api/acc';

import style from './index.module.pcss';

interface ISelect {
    value: string,
    label: string
}

interface IFormValues extends Request {
    industry_sector: {
        value: string,
        label: string
    },
    customer: {
        value: string,
        label: string
    },
    project: {
        value: string,
        label: string
    },
    type: {
        value: string,
        label: string
    },
    prioritySelect: {
        value: NoName2,
        label: string
    },
    statusSelect: {
        value: NoName4,
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
    defaultValues?: RequestRead
}

enum ETabs {
    Main,
    ProjectTiming
}

const statusInvariants = ['closed', 'done', 'draft', 'in_progress'];
const priorityInvariants = ['10', '20', '30'];

const ProjectsRequestForm = ({ formId, onSuccess, defaultValues }: IProjectsRequestForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const params = useParams<{ organizationId: string, projectId: string }>();

    const [post] = mainRequest.usePostMainRequestMutation();
    const [patch] = mainRequest.usePatchMainRequestMutation();
    const { data: accUsersData } = acc.useGetAccUserQuery(undefined);
    const { data: projectData } = mainRequest.useGetMainOrganizationProjectByIdQuery({ id: params.projectId }, { skip: !params.projectId });

    const [activeTab, setActiveTab] = useState<ETabs>(ETabs.Main);
    const [options, setOptions] = useState<Array<IValue>>([]);

    useEffect(() => {
        if(accUsersData?.results) {
            const newOptions = accUsersData?.results.map((item) => ({
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
    } : {};

    const form = useForm({
        defaultValues: {
            ...defaultValues,
            recruiter: defaultValues?.recruiter ? {
                value: defaultValues?.recruiter?.id,
                label: `${defaultValues?.recruiter?.last_name} ${defaultValues?.recruiter?.first_name}`
            } : '',
            resource_manager: defaultValues?.resource_manager ? {
                value: defaultValues?.resource_manager?.id,
                label: `${defaultValues?.resource_manager?.last_name} ${defaultValues?.resource_manager?.first_name}`
            } : '',
            industry_sector: defaultValues?.industry_sector ? {
                value: defaultValues?.industry_sector?.id,
                label: defaultValues?.industry_sector?.name
            } : '',
            customer: defaultValues?.module?.organization_project ? {
                value: defaultValues?.module.organization_project.organization_id,
                label: defaultValues?.module.organization_project.organization?.name
            } : '',
            project: defaultValues?.module?.organization_project ? {
                value: defaultValues?.module.organization_project?.id,
                label: defaultValues?.module.organization_project?.name
            } : '',
            type: defaultValues?.type ? {
                value: defaultValues?.type?.id,
                label: defaultValues?.type?.name
            } : '',
            prioritySelect: defaultValues?.priority ? {
                value: defaultValues?.priority,
                label: t(`routes.project-request.blocks.priority.${defaultValues?.priority}`)
            } : '',
            statusSelect: defaultValues?.status ? {
                value: defaultValues?.status,
                label: t(`routes.project-request.blocks.status.${defaultValues?.status}`)
            } : '',
            period: [defaultDates]
        }
    });
    const { fields } = useFieldArray({
        keyName: 'fieldId',
        control: form.control,
        name   : 'period'
    });

    useEffect(() => {
        form.setValue('period', [defaultDates]);
    }, [JSON.stringify(projectData)]);

    const onSubmit: SubmitHandler<IFormValues> = ({
        period,
        industry_sector,
        project,
        customer,
        prioritySelect,
        statusSelect,
        type,
        resource_manager,
        recruiter,
        ...data
    }) => {
        const postData = {
            ...data,
            ...period[0]
        };

        if(industry_sector) {
            postData.industry_sector_id = parseInt(industry_sector.value, 10);
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
            id                     : requestId as number
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
    };
    const errorMessage = t('routes.project-request.create.required-error');

    return (
        <React.Fragment>
            <Tabs>
                <Tab
                    active={activeTab === ETabs.Main}
                    onClick={() => {
                        setActiveTab(ETabs.Main);
                    }}
                >
                    {t('routes.project-request.blocks.tabs.main')}
                </Tab>
                <Tab
                    active={activeTab === ETabs.ProjectTiming}
                    onClick={() => {
                        setActiveTab(ETabs.ProjectTiming);
                    }}
                >
                    {t('routes.project-request.blocks.tabs.project-timing')}
                </Tab>
            </Tabs>
            <FormProvider {...form}>
                <form method="POST" id={formId} onSubmit={form.handleSubmit(onSubmit)}>
                    <div className={cn('form', { 'hide': activeTab === ETabs.ProjectTiming })}>
                        <Input
                            type="text"
                            name="title"
                            label={t('routes.project-request.create.form-title')}
                        />
                        <InputDictionary
                            isMulti={false}
                            requestType={InputDictionary.requestType.IndustrySector}
                            name="industry_sector"
                            direction="column"
                            label={t('routes.project-request.create.industry_sector')}
                        />
                        <InputMain
                            defaultValue={[params.organizationId]}
                            isMulti={false}
                            requestType={InputMain.requestType.Customer}
                            name="customer"
                            direction="column"
                            label={t('routes.project-request.create.customer')}
                            required={errorMessage}
                            disabled={!!params.organizationId}
                        />
                        <InputProject
                            defaultValue={params.projectId}
                            name="project"
                            direction="column"
                            label={t('routes.project-request.create.project')}
                            disabled={!!params.projectId}
                        />
                        <Select
                            name="recruiter"
                            direction="column"
                            label={t('routes.project-request.create.recruiter')}
                            options={options}
                        />
                        <div className={cn('field-group')}>
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
                        <div className={cn('field-group')}>
                            <Select
                                name="prioritySelect"
                                label={t('routes.project-request.create.priority')}
                                direction="column"
                                options={priorityInvariants.map((priority) => ({
                                    label: t(`routes.project-request.blocks.priority.${priority}`),
                                    value: priority
                                }))}
                            />
                            <Select
                                name="statusSelect"
                                label={t('routes.project-request.create.status')}
                                direction="column"
                                options={statusInvariants.map((status) => ({
                                    label: t(`routes.project-request.blocks.status.${status}`),
                                    value: status
                                }))}
                            />
                        </div>
                        <Textarea
                            name="description"
                            label={t('routes.project-request.create.description')}
                            rows={2}
                        />
                    </div>
                    <div className={cn('form', { 'hide': activeTab === ETabs.Main })}>
                        {fields.map((field, index) => (
                            <DeadlineDates
                                key={field.fieldId}
                                nameDateFrom={`period.${index}.start_date`}
                                nameDateTo={`period.${index}.deadline_date`}
                                labels={{
                                    dateFrom: t('routes.project-request.blocks.period-form.date_from'),
                                    dateTo  : t('routes.project-request.blocks.period-form.date_to')
                                }}
                                defaultValues={{
                                    dateFrom: field?.start_date || projectData?.date_from,
                                    dateTo  : field?.deadline_date || projectData?.date_to
                                }}
                            />
                        ))}
                        {/* TODO Добавить блок приостановки проекта, как будет готов бек */}
                        {/* <a
                            href="#append"
                            className={cn('append')}
                            onClick={(event) => {
                                event.preventDefault();
                                append({});
                            }}
                        >{t('routes.project-request.blocks.period-form.add')}
                        </a> */}
                    </div>
                </form>
            </FormProvider>
        </React.Fragment>
    );
};

export default ProjectsRequestForm;
