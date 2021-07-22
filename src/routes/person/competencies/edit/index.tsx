import React, { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';

import useClassnames, { IStyle } from 'hook/use-classnames';
import FormInput from 'component/form/input';
import Button from 'component/button';
import Modal from 'component/modal';
import DateInput from 'component/form/date';

import style from './index.module.pcss';

export interface IField {
    role?: string
}

export interface IProps {
    className?: string | IStyle,
    fields?: Array<IField>,
    onSubmit?(payload: Array<IField>): void,
    onCancel?(): void
}

export const CompetenciesEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const methods = useForm({
        defaultValues: {
            competencies: props.fields || [{}]
        }
    });
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name   : 'competencies'
    });

    const elAppend = useMemo(() => {
        if(true) {
            return (
                <a
                    href="#append"
                    className={cn('competencies-edit__link-append')}
                    children={t('routes.person.blocks.competencies.edit.buttons.append')}
                    onClick={(e: MouseEvent) => {
                        e.preventDefault();

                        append({});
                    }}
                />
            );
        }
    }, []);

    const elFooter = useMemo(() => {
        return (
            <div className={cn('competencies-edit__form-footer')}>
                {elAppend}
                <Button isSecondary={true} onClick={props.onCancel} className={cn('competencies-edit__button-secondary')}>
                    {t('routes.person.blocks.competencies.edit.buttons.cancel')}
                </Button>
                <Button type="submit">{t('routes.person.blocks.competencies.edit.buttons.save')}</Button>
            </div>
        );
    }, []);

    const elFormContent = () => {
        return (
            <div className={cn('')}>

            </div>
        );
    };

    return (
        <Modal className={cn('competencies-edit')} footer={elFooter} header={t('routes.person.blocks.competencies.edit.title')}>
            <form
                onSubmit={methods.handleSubmit(({ competencies }) => {
                    if(props.onSubmit) {
                        props.onSubmit(competencies);
                    }
                })}
            >
                <FormProvider {...methods}>
                    {elFormContent()}
                </FormProvider>
            </form>
        </Modal>
    );
};

export default CompetenciesEdit;
