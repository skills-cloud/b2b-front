import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext, Message } from 'react-hook-form';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import { ErrorMessage } from '@hookform/error-message';

import useClassnames, { IStyle } from 'hook/use-classnames';

import Error from 'component/error';

import style from './index.module.pcss';

export interface IProps {
    name: string,
    placeholder?: string,
    className?: string | IStyle,
    label?: string,
    required?: Message | ValidationRule<boolean>
}

export const Textarea = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors, touchedFields, isSubmitted }, register } = useFormContext();

    const [isWatch, setIsWatch] = useState<boolean>(touchedFields[props.name]);

    useEffect(() => {
        setIsWatch(touchedFields[props.name] || isSubmitted);
    }, [touchedFields[props.name], isSubmitted]);

    const attrs = {
        className: cn('input', {
            'input_invalid': errors?.[props.name]?.message && isWatch
        }),
        placeholder: props.placeholder,
        ...register(props.name, {
            required: props.required
        })
    };

    const elError = useMemo(() => {
        if(errors?.[props.name]?.message && isWatch) {
            return (
                <ErrorMessage
                    as={Error}
                    name={props.name}
                    elIcon={true}
                    errors={errors}
                    className={cn('field__error')}
                />
            );
        }
    }, [props.name, errors?.[props.name], isWatch]);

    const elLabel = useMemo(() => {
        if(props.label) {
            return <strong className={cn('input__label-text')}>{props.label}</strong>;
        }
    }, [props.label]);

    if(props.label) {
        return (
            <label className={cn('input__label')}>
                {elLabel}
                <textarea {...attrs} />
                {elError}
            </label>
        );
    }

    return <textarea {...attrs} />;
};

export default Textarea;
