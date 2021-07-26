import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import Input from 'component/form/input';
import Select from 'component/form/select';
import Textarea from 'component/form/textarea';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface ISelect {
    value: string,
    label: string
}

interface IFormValues {
    industry: string,
    employer: string,
    project: string,
    manager: string,
    recruiter: string,
    'request-type': ISelect,
    priority: ISelect,
    status: ISelect,
    description: string
}

interface IProjectsRequestForm {
    formId: string
}

const ProjectsRequestForm = ({ formId }: IProjectsRequestForm) => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const form = useForm<IFormValues>();

    const onSubmit: SubmitHandler<IFormValues> = () => {
        // TODO handle submit form
    };
    const errorMessage = t('routes.project-request.create.required-error');

    return (
        <FormProvider {...form}>
            <form method="POST" id={formId} className={cn('form')} onSubmit={form.handleSubmit(onSubmit)}>
                <Input
                    name="industry"
                    type="text"
                    label={t('routes.project-request.create.industry')}
                    required={errorMessage}
                />
                <Input
                    name="employer"
                    type="text"
                    label={t('routes.project-request.create.employer')}
                    required={errorMessage}
                />
                <Input
                    name="project"
                    type="text"
                    label={t('routes.project-request.create.project')}
                    required={errorMessage}
                />
                <Input
                    name="recruiter"
                    type="text"
                    label={t('routes.project-request.create.recruiter')}
                    required={errorMessage}
                />
                <div className={cn('field-group')}>
                    <Input
                        name="manager"
                        type="text"
                        label={t('routes.project-request.create.manager')}
                        required={errorMessage}
                    />
                    <Select
                        name="request-type"
                        direction="column"
                        required={errorMessage}
                        label={t('routes.project-request.create.requestType')}
                        options={[]}
                    />
                </div>
                <div className={cn('field-group')}>
                    <Select
                        name="priority"
                        required={errorMessage}
                        label={t('routes.project-request.create.priority')}
                        direction="column"
                        options={[]}
                    />
                    <Select
                        name="status"
                        label={t('routes.project-request.create.status')}
                        required={errorMessage}
                        direction="column"
                        options={[]}
                    />
                </div>
                <Textarea
                    name="description"
                    required={errorMessage}
                    label={t('routes.project-request.create.description')}
                    rows={2}
                />
            </form>
        </FormProvider>
    );
};

export default ProjectsRequestForm;
