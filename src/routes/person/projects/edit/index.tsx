import React, { useEffect, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import FormInputSkills from 'component/form/input-skills';
import IconClose from 'component/icons/close';
import Button from 'component/button';

import style from './index.module.pcss';

export interface IField {
    name?: string,
    customer?: string,
    date?: {
        from?: string,
        to?: string
    },
    description?: string,
    role?: string,
    skills?: Array<{
        label: string,
        value: string
    }>
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export const ProjectsEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const methods = useForm({
        defaultValues: {
            project: props.fields || [{}]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name   : 'project'
    });

    useEffect(() => {
        if(fields.length) {
            methods.setFocus(`project.${fields.length - 1}.name` as `project.${number}.name`);
        }
    }, [methods.setFocus]);

    return (
        <div className={cn('projects-edit')}>
            <form
                className={cn('projects-edit__form')}
                onSubmit={methods.handleSubmit(({ project }) => {
                    if(props.onSubmit) {
                        const payload = project.filter((item) => item.name || item.customer || item.role || item.description || item.skills || item.date?.to || item.date?.from);

                        props.onSubmit(payload);
                    }
                })}
            >
                <div className={cn('projects-edit__form-body')}>
                    <h2 className={cn('projects-edit__header')}>{t('routes.person.projects.header')}</h2>
                    <FormProvider {...methods}>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className={cn('projects-edit__project')}
                            >
                                <IconClose
                                    svg={{
                                        width    : 14,
                                        height   : 14,
                                        className: cn('projects-edit__project-icon-remove'),
                                        onClick  : () => {
                                            remove(index);
                                        }
                                    }}
                                />
                                <div className={cn('projects-edit__field')}>
                                    <strong>{t('routes.person.projects.fields.name')}</strong>
                                    <FormInput name={`project.${index}.name`} type="text" />
                                </div>
                                <div className={cn('projects-edit__field')}>
                                    <strong>{t('routes.person.projects.fields.customer')}</strong>
                                    <FormInput name={`project.${index}.customer`} type="text" />
                                </div>
                                <div className={cn('projects-edit__field', 'projects-edit__field_dates')}>
                                    <strong>{t('routes.person.projects.fields.date')}</strong>
                                    <FormDate name={`project.${index}.date.from`} />
                                    &mdash;
                                    <FormDate name={`project.${index}.date.to`} />
                                </div>
                                <div className={cn('projects-edit__field')}>
                                    <strong>{t('routes.person.projects.fields.role')}</strong>
                                    <FormInput name={`project.${index}.role`} type="text" />
                                </div>
                                <div className={cn('projects-edit__field')}>
                                    <strong>{t('routes.person.projects.fields.skills')}</strong>
                                    <FormInputSkills name={`project.${index}.skills`} />
                                </div>
                                <div className={cn('projects-edit__field')}>
                                    <strong>{t('routes.person.projects.fields.description')}</strong>
                                    <FormInput name={`project.${index}.description`} type="text" />
                                </div>
                            </div>
                        ))}
                    </FormProvider>
                </div>
                <div className={cn('projects-edit__form-footer')}>
                    <a
                        href="#append"
                        className={cn('projects-edit__link-append')}
                        children={t('routes.person.projects.edit.buttons.append')}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();

                            append({});
                        }}
                    />
                    <Button isSecondary={true} onClick={props.onCancel}>{t('routes.person.projects.edit.buttons.cancel')}</Button>
                    <Button type="submit">{t('routes.person.projects.edit.buttons.save')}</Button>
                </div>
            </form>
        </div>
    );
};

export default ProjectsEdit;
