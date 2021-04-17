import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useFormContext, Message } from 'react-hook-form';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { ErrorMessage } from '@hookform/error-message';

import useClassnames, { IStyle } from 'hook/use-classnames';

import Error from 'component/error';

import style from './index.module.pcss';

export interface IProps {
    name: string,
    type: 'text' | 'search',
    placeholder?: string,
    className?: string | IStyle,
    label?: string,
    required?: Message | ValidationRule<boolean>,
    maxLength?: ValidationRule<number | string>,
    minLength?: ValidationRule<number | string>,
    pattern?: ValidationRule<RegExp>
}

export const Input = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { register, formState } = useFormContext();

    const [isWatch, setIsWatch] = useState<boolean>(formState.touchedFields[props.name]);

    useEffect(() => {
        setIsWatch(formState.touchedFields[props.name] || formState.isSubmitted);
    }, [formState.touchedFields[props.name], formState.isSubmitted]);

    const attrs = {
        className: cn('input', {
            'input_invalid': formState?.errors?.[props.name]?.message && isWatch
        }),
        type       : props.type,
        placeholder: props.placeholder,
        ...register(props.name, {
            required : props.required,
            maxLength: props.maxLength,
            minLength: props.minLength,
            pattern  : props.pattern
        })
    };

    const elError = useMemo(() => {
        if(formState?.errors?.[props.name]?.message && isWatch) {
            return (
                <ErrorMessage
                    as={Error}
                    name={props.name}
                    elIcon={true}
                    errors={formState?.errors}
                    className={cn('field__error')}
                />
            );
        }
    }, [props.name, formState?.errors?.[props.name], isWatch]);

    const elLabel = useMemo(() => {
        if(props.label) {
            return <strong className={cn('input__label-text')}>{props.label}</strong>;
        }
    }, [props.label]);

    if(props.label) {
        return (
            <label className={cn('input__label')}>
                {elLabel}
                <input {...attrs} />
                {elError}
            </label>
        );
    }

    return <input {...attrs} />;
};

export default Input;
