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
    company?: string,
    date?: {
        from?: string,
        to?: string
    },
    description?: string,
    role?: string,
    projects?: string,
    skills?: Array<{
        label: string,
        value: string
    }>,
    file?: {
        type: string,
        name: string,
        url: string
    }
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export const CareerEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const methods = useForm({
        defaultValues: {
            career: props.fields || [{}]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name   : 'career'
    });

    useEffect(() => {
        if(fields.length) {
            methods.setFocus(`career.${fields.length - 1}.company` as `career.${number}.company`);
        }
    }, [methods.setFocus]);

    return (
        <div className={cn('career-edit')}>
            <form
                className={cn('career-edit__form')}
                onSubmit={methods.handleSubmit(({ career }) => {
                    if(props.onSubmit) {
                        const payload = career.filter((item) => item.company || item.role || item.description || item.skills || item.date?.to || item.date?.from);

                        props.onSubmit(payload);
                    }
                })}
            >
                <div className={cn('career-edit__form-body')}>
                    <h2 className={cn('career-edit__header')}>{t('routes.person.career.header')}</h2>
                    <FormProvider {...methods}>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className={cn('career-edit__career')}
                            >
                                <IconClose
                                    svg={{
                                        width    : 14,
                                        height   : 14,
                                        className: cn('career-edit__career-icon-remove'),
                                        onClick  : () => {
                                            remove(index);
                                        }
                                    }}
                                />
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.company')}</strong>
                                    <FormInput name={`career.${index}.company`} type="text" />
                                </div>
                                <div className={cn('career-edit__field', 'career-edit__field_dates')}>
                                    <strong>{t('routes.person.career.fields.date')}</strong>
                                    <FormDate name={`career.${index}.date.from`} />
                                    &mdash;
                                    <FormDate name={`career.${index}.date.to`} />
                                </div>
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.role')}</strong>
                                    <FormInput name={`career.${index}.role`} type="text" />
                                </div>
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.skills')}</strong>
                                    <FormInputSkills name={`career.${index}.skills`} />
                                </div>
                                <div className={cn('career-edit__field')}>
                                    <strong>{t('routes.person.career.fields.description')}</strong>
                                    <FormInput name={`career.${index}.description`} type="text" />
                                </div>
                            </div>
                        ))}
                    </FormProvider>
                </div>
                <div className={cn('career-edit__form-footer')}>
                    <a
                        href="#append"
                        className={cn('career-edit__link-append')}
                        children={t('routes.person.career.edit.buttons.append')}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();

                            append({});
                        }}
                    />
                    <Button isSecondary={true} onClick={props.onCancel}>{t('routes.person.career.edit.buttons.cancel')}</Button>
                    <Button type="submit">{t('routes.person.career.edit.buttons.save')}</Button>
                </div>
            </form>
        </div>
    );
};

export default CareerEdit;
