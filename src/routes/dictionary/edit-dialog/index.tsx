import React, { ReactNode } from 'react';
// import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Modal from 'component/modal';
import Button from 'component/button';
import Error from 'component/error';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    onClose?(): void,
    onSubmit?(formPayload: Record<string, unknown>): void,
    cancelButtonText?: string,
    mainButtonText?: string,
    title?: ReactNode,
    text?: ReactNode,
    isLoading?: boolean,
    isError?: boolean,
    error?: ReactNode,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    defaultFormValues?: Record<string, any>,
    inputs?: ReactNode
}

// @TODO Translate
export const EditDictionaryItem = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    // const { t } = useTranslation();
    const form = useForm({
        defaultValues: props.defaultFormValues
    });

    return (
        <Modal header={props.title} onClose={props.onClose}>
            <div className={cn('edit-dictionary-item')}>
                {props.text && <p className={cn('edit-dictionary-item__text')}>{props.text}</p>}
                <FormProvider {...form}>
                    <form className={cn('edit-dictionary-item__form')}>
                        {props.inputs}
                    </form>
                </FormProvider>
                <div className={cn('edit-dictionary-item__buttons')}>
                    <Button isSecondary={true} onClick={props.onClose}>{props.cancelButtonText || 'Отмена'}</Button>
                    <Button
                        type="submit"
                        isLoading={props.isLoading}
                        disabled={props.isLoading}
                        onClick={form.handleSubmit((payload) => {
                            props.onSubmit?.(payload);
                        })}
                    >
                        {props.mainButtonText || 'Подтвердить'}
                    </Button>
                </div>
                {props.isError && (
                    <Error>{JSON.stringify(props.error)}</Error>
                )}
            </div>
        </Modal>
    );
};

export default EditDictionaryItem;
