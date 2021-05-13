import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import Button from 'component/button';

import style from './index.module.pcss';

export interface IField {
    hour?: string,
    day?: string,
    month?: string
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export const RateEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const methods = useForm({
        defaultValues: {
            rate: props.fields || []
        }
    });

    const { fields } = useFieldArray({
        control: methods.control,
        name   : 'rate'
    });

    return (
        <div className={cn('rate-edit')}>
            <form
                className={cn('rate-edit__form')}
                onSubmit={methods.handleSubmit(({ rate }) => {
                    if(props.onSubmit) {
                        const payload = rate.filter((item) => item.day || item.hour || item.month);

                        props.onSubmit(payload);
                    }
                })}
            >
                <div className={cn('rate-edit__form-body')}>
                    <h1 className={cn('rate-edit__header')}>{t('routes.person.rate.header')}</h1>
                    <FormProvider {...methods}>
                        {fields?.map((field, index) => (
                            <div key={field.id} className={cn('rate-edit__item')}>
                                <h3>{t(`routes.person.rate.${index === 0 ? 'remote' : 'office'}`)}</h3>
                                <div className={cn('rate-edit__field')}>
                                    <strong>{t('routes.person.rate.hour')}</strong>
                                    <FormInput name={`rate.${index}.hour`} type="text" />
                                </div>
                                <div className={cn('rate-edit__field')}>
                                    <strong>{t('routes.person.rate.day')}</strong>
                                    <FormInput name={`rate.${index}.day`} type="text" />
                                </div>
                                <div className={cn('rate-edit__field')}>
                                    <strong>{t('routes.person.rate.month')}</strong>
                                    <FormInput name={`rate.${index}.month`} type="text" />
                                </div>
                            </div>
                        ))}
                    </FormProvider>
                </div>
                <div className={cn('rate-edit__form-footer')}>
                    <Button isSecondary={true} onClick={props.onCancel}>{t('routes.person.projects.edit.buttons.cancel')}</Button>
                    <Button type="submit">{t('routes.person.projects.edit.buttons.save')}</Button>
                </div>
            </form>
        </div>
    );
};

export default RateEdit;
