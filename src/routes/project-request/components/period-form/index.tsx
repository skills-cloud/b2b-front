import React, { useEffect } from 'react';
import FormDate from 'component/form/date';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider, SubmitHandler, useFieldArray } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

interface IFormValues {
    project_request: {
        date_from: string,
        date_to: string
    }
}

interface IPeriodForm {
    formId: string
}

const PeriodForm = ({ formId }: IPeriodForm) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const form = useForm();
    const { fields, append } = useFieldArray({
        keyName: 'fieldId',
        control: form.control,
        name   : 'project_request'
    });

    useEffect(() => {
        append({});
    }, []);

    const onSubmit: SubmitHandler<IFormValues> = () => {
        // TODO handle submit form
    };
    const errorMessage = t('routes.project-request.create.required-error');

    return (
        <FormProvider {...form}>
            <form method="POST" id={formId} className={cn('form')} onSubmit={form.handleSubmit(onSubmit)}>
                {fields.map((field) => (
                    <div className={cn('field-group')} key={field.fieldId}>
                        <FormDate
                            name="project_request.date_from"
                            label={t('routes.project-request.blocks.perion-form.date_from')}
                            required={errorMessage}
                            direction="column"
                        />
                        <div className={cn('field-group__separator')} />
                        <FormDate
                            name="project_request.date_to"
                            label={t('routes.project-request.blocks.perion-form.date_to')}
                            required={errorMessage}
                            direction="column"
                        />
                    </div>
                ))}
            </form>
            <a
                href="#append"
                className={cn('append')}
                onClick={(event) => {
                    event.preventDefault();
                    append({});
                }}
            >{t('routes.project-request.blocks.perion-form.add')}
            </a>
        </FormProvider>
    );
};

export default PeriodForm;
