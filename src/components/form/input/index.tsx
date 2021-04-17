import React from 'react';
import { useFormContext, Message } from 'react-hook-form';
import { ValidationRule } from 'react-hook-form/dist/types/validator';

import useClassnames, { IStyle } from 'hook/use-classnames';

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
    const context = useFormContext();

    const attrs = {
        className  : cn('input'),
        type       : props.type,
        placeholder: props.placeholder,
        ...context.register(props.name, {
            required : props.required,
            maxLength: props.maxLength,
            minLength: props.minLength,
            pattern  : props.pattern
        })
    };

    if(props.label) {
        return (
            <label className={cn('input__label')}>
                {props.label}
                <input {...attrs} />
            </label>
        );
    }

    return <input {...attrs} />;
};

export default Input;
