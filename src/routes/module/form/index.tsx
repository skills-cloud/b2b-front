import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import { useClassnames } from 'hook/use-classnames';

import Select, { IValue } from 'component/form/select';
import Textarea from 'component/form/textarea';
import DeadlineDates from 'component/form/deadline-dates';
import InputProject from 'component/form/input-project';
import Input from 'component/form/input';
import InputMain from 'component/form/input-main';
import Error from 'component/error';

import { ModuleWrite } from 'adapter/types/main/module/id/patch/code-200';
import { ModuleRead } from 'adapter/types/main/module/id/get/code-200';
import { mainRequest } from 'adapter/api/main';
import { acc } from 'adapter/api/acc';

import style from './index.module.pcss';

interface ISelect {
    value: string,
    label: string
}

interface IFormValues extends ModuleWrite {
    project: ISelect,
    customer: ISelect,
    manager: ISelect,
    start_date?: string | undefined,
    deadline_date?: string | undefined
}

interface IProjectsRequestForm {
    formId: string,
    onSuccess: (id: number) => void,
    defaultValues?: ModuleRead
}

const ModuleCreateForm = ({ formId, onSuccess, defaultValues }: IProjectsRequestForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const params = useParams<IParams>();

    const [post, { error, isLoading, isError }] = mainRequest.usePostMainModuleMutation();
    const [patch, { error: patchError, isLoading: isPatchLoading, isError: isPatchError }] = mainRequest.usePatchMainModuleMutation();
    const { data: accUsersData } = acc.useGetAccUserQuery(undefined);
    const { data: projectData } = mainRequest.useGetMainOrganizationProjectByIdQuery({
        id: params.projectId
    }, {
        skip: !params.projectId
    });

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

    const startDate = defaultValues?.start_date || projectData?.date_from;
    const deadlineDate = defaultValues?.deadline_date || projectData?.date_to;
    const defaultDates = startDate && deadlineDate ? {
        start_date   : startDate,
        deadline_date: deadlineDate
    } : {};

    const form = useForm<IFormValues>({
        defaultValues: {
            ...defaultValues,
            customer: defaultValues?.organization_project?.organization_customer ? {
                value: String(defaultValues?.organization_project.organization_customer.id),
                label: defaultValues?.organization_project.organization_customer.name
            } : undefined,
            project: defaultValues?.organization_project ? {
                value: String(defaultValues?.organization_project?.id),
                label: defaultValues?.organization_project?.name
            } : undefined,
            start_date   : defaultDates?.start_date,
            deadline_date: defaultDates?.deadline_date
        }
    });

    useEffect(() => {
        form.setValue('start_date', defaultDates.start_date);
        form.setValue('deadline_date', defaultDates.deadline_date);
    }, [JSON.stringify(projectData)]);

    const onSubmit = form.handleSubmit((formData) => {
        const method = defaultValues ? patch : post;
        const { customer, project, manager, ...rest } = formData;

        const request = method({
            ...rest,
            organization_project_id: parseInt(formData.project.value, 10)
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

    const errorMessage = t('routes.module.create.required-error');

    const elErrors = useMemo(() => {
        const errors = (error || patchError) as {
            data: {
                details: Record<string, Array<string>> | string
            }
        };

        if(errors?.data?.details && typeof errors?.data?.details !== 'string') {
            const keys = Object.keys(errors.data.details);

            return (
                <div>
                    {keys.map((key) => {
                        if(typeof errors?.data?.details?.[key] === 'string') {
                            return <Error key={key}>{`${key}: ${errors?.data?.details?.[key]}`}</Error>;
                        }

                        return (errors?.data?.details as Record<string, Array<string>>)?.[key]?.map((message, index) => (
                            <Error key={`${key}-${index}}`}>{message}</Error>
                        ));
                    })}
                </div>
            );
        }

        return <Error>{errors?.data?.details}</Error>;
    }, [isError, isPatchError, isLoading, isPatchLoading, patchError, error]);

    return (
        <FormProvider {...form}>
            <form
                method="POST"
                id={formId}
                onSubmit={onSubmit}
                className={cn('module-create__form')}
            >
                <Input
                    required={errorMessage}
                    type="text"
                    name="name"
                    label={t('routes.module.create.form-title')}
                />
                <InputMain
                    name="customer"
                    isMulti={false}
                    disabled={!!params.organizationId}
                    defaultValue={[params.organizationId]}
                    requestType={InputMain.requestType.Customer}
                    label={t('routes.module.create.customer')}
                    direction="column"
                />
                <InputProject
                    defaultValue={params.projectId}
                    name="project"
                    direction="column"
                    label={t('routes.module.create.project')}
                    disabled={!!params.projectId}
                />
                <Select
                    name="manager"
                    direction="column"
                    label={t('routes.module.create.manager')}
                    options={options}
                />
                <Textarea
                    name="goals"
                    label={t('routes.module.create.goals')}
                />
                <DeadlineDates
                    nameDateFrom="start_date"
                    nameDateTo="deadline_date"
                    labels={{
                        dateFrom: t('routes.module.create.period-form.date_from'),
                        dateTo  : t('routes.module.create.period-form.date_to')
                    }}
                />
                <Textarea
                    name="description"
                    label={t('routes.module.create.description')}
                />
                {elErrors}
            </form>
        </FormProvider>
    );
};

export default ModuleCreateForm;
