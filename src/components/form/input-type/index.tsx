import React, { useState, FC, ReactNode, MouseEvent, useEffect, useMemo } from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';
import ReactSelect, { components, OptionTypeBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, Message, useFormContext } from 'react-hook-form';
import { ValidationRule } from 'react-hook-form/dist/types/validator';

import { useClassnames, IStyle } from 'hook/use-classnames';

import Error from 'component/error';
import IconClose from 'component/icons/close';

import { mainRequest } from 'adapter/api/main';

import getStyles from './style';
import style from './index.module.pcss';

export type TError = string | null;

export interface IValue {
    label: string,
    value: string | number
}

export interface IProps {
    className?: string | IStyle,
    name: string,
    direction?: 'row' | 'column',
    required?: Message | ValidationRule<boolean>,
    label?: ReactNode,
    createable?: boolean,
    autoFocus?: boolean,
    clearable?: boolean,
    placeholder?: string,
    tabIndex?: string,
    disabled?: boolean,
    isLoading?: boolean,
    defaultValue?: IValue | number | string,
    error?: TError,
    requestLimit?: number,
    requestOffset?: number,
    elError?: boolean,
    onChange?(value: IValue): void,
    onCreateOption?(value: string): void
}

const MultiValueRemove: FC<MultiValueRemoveProps<Record<string, unknown>>> = (props) => {
    const onClick = (e: MouseEvent): void => {
        if(!props.selectProps.isDisabled) {
            props.innerProps.onClick(e);
        }
    };

    return (
        <IconClose
            svg={{
                ...props.innerProps,
                onClick,
                width : 16,
                height: 16
            }}
        />
    );
};

const defaultProps = {
    direction: 'row',
    isMulti  : true
};

const InputType = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors }, watch, trigger, control, setValue } = useFormContext();

    const [isFocus, setIsFocus] = useState(false);
    const value = watch(props.name);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SelectInput: FC<any> = useMemo(() => ({ children, ...args }) => (
        <components.Input {...args}>
            {children}
        </components.Input>
    ), []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Option: FC<any> = useMemo(() => ({ children, ...args }) => (
        <components.Option {...args}>
            <p className={cn('input__option')}>{children}</p>
        </components.Option>
    ), []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MultiValue: FC<any> = useMemo(() => ({ children, ...args }) => (
        <components.MultiValue {...args} className={cn('input__multivalue')}>
            {children}
        </components.MultiValue>
    ), []);

    useEffect(() => {
        if(value) {
            void trigger(props.name);
        }
    }, []);

    const { data } = mainRequest.useGetMainFunPointTypeQuery(undefined);

    const { data: dataById } = mainRequest.useGetMainFunPointTypeByIdQuery({
        id: String(props.defaultValue)
    }, {
        skip: !props.defaultValue
    });

    useEffect(() => {
        if(dataById) {
            const newValue = {
                label: dataById?.name || '',
                value: String(dataById?.id) || ''
            };

            setValue(props.name, newValue, { shouldDirty: true });
        }
    }, [JSON.stringify(dataById)]);

    const options = useMemo(() => {
        return data?.results.map((item) => ({
            label: item.name,
            value: String(item.id)
        })) || [];
    }, [JSON.stringify(data?.results)]);

    const onFocus = (): void => {
        if(!isFocus) {
            setIsFocus(true);
        }
    };

    const elLabel = (): ReactNode => {
        if(props.label) {
            return (
                <strong
                    className={cn('input__label', {
                        'input__label_required': props.required
                    })}
                >
                    {props.label}
                </strong>
            );
        }
    };

    const elError = useMemo(() => {
        if(props.elError !== false) {
            return <ErrorMessage as={Error} name={props.name} errors={errors} className={cn('input__error')} />;
        }
    }, [props.elError, props.name, errors[props.name]]);

    const elInput = (renderValue: OptionTypeBase, onChange: () => void, onBlur: () => void): ReactNode => {
        const selectProps = {
            onFocus,
            onBlur,
            onChange,
            value         : renderValue,
            defaultValue  : renderValue,
            isLoading     : props.isLoading,
            placeholder   : props.placeholder,
            autoFocus     : props.autoFocus,
            isClearable   : props.clearable,
            tabIndex      : props.tabIndex,
            cacheOption   : true,
            defaultOptions: true,
            isDisabled    : props.disabled,
            components    : { MultiValueRemove, MultiValue, Option, Input: SelectInput },
            styles        : getStyles(props, isFocus),
            className     : cn('input__field', {
                'input__field_invalid': errors[props.name]
            })
        };

        if(props.createable) {
            return <CreatableSelect onCreateOption={props.onCreateOption} {...selectProps} options={options} />;
        }

        return <ReactSelect {...selectProps} options={options} />;
    };

    return (
        <Controller
            name={props.name}
            control={control}
            rules={{ required: props.required }}
            render={({ field: { onChange, onBlur, value: renderValue } }) => {
                return (
                    <label className={cn('input')}>
                        <div className={cn('input__wrapper', `input__wrapper_${props.direction}`)}>
                            {elLabel()}
                            {elInput(renderValue, onChange, onBlur)}
                        </div>
                        {elError}
                    </label>
                );
            }}
        />
    );
};

InputType.defaultProps = defaultProps;

export default InputType;
