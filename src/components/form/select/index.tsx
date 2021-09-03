import React, { useState, useMemo, FC, useEffect, useCallback, MouseEvent } from 'react';
import ReactSelect, { components } from 'react-select';
import ReactSelectAsync from 'react-select/async';
import { useFormContext, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { useClassnames } from 'hook/use-classnames';
import Error from 'component/error';

import getStyles from './style';
import { TProps, IValue } from './types';
import style from './index.module.pcss';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';
import IconClose from 'component/icons/close';

const defaultProps = {
    direction          : 'row',
    disableAutocomplete: false
};

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

const InputSelect = (props: TProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);

    const { formState: { errors }, watch, trigger, control } = useFormContext();
    const value = watch(props.name);

    const [isFocus, setIsFocus] = useState(false);
    const [suggests, setSuggests] = useState<Array<IValue>>(props.options || []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SelectInput: FC<any> = useMemo(() => ({ children, ...args }) => (
        <components.Input {...args}>
            {children}
        </components.Input>
    ), []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Option: FC<any> = useMemo(() => ({ children, ...args }) => (
        <components.Option {...args}>
            {children}
        </components.Option>
    ), []);

    useEffect(() => {
        if(props.options) {
            setSuggests(props.options);
        }
    }, [JSON.stringify(props.options)]);
    useEffect(() => {
        if(value) {
            void trigger(props.name);
        }
    }, []);

    const onInputChange = useCallback((inputValue: string) => {
        const newSuggests = props.options?.filter((suggest: IValue) => {
            return suggest.label?.toLowerCase().includes(inputValue.toLowerCase());
        });

        if(newSuggests) {
            setSuggests(newSuggests);
        }
    }, [JSON.stringify(props.options)]);

    const onFocus = useCallback(() => {
        if(!isFocus) {
            setIsFocus(true);
        }
    }, [isFocus]);

    const elLabel = useMemo(() => {
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
    }, [props.label, props.required, errors[props.name]]);

    const elError = useMemo(() => {
        if(props.elError !== false) {
            return <ErrorMessage as={Error} name={props.name} errors={errors} elIcon={true} className={cn('input__error')} />;
        }
    }, [props.elError, props.name, errors[props.name]]);

    return (
        <Controller
            name={props.name}
            control={control}
            defaultValue={props.defaultValue}
            rules={{ required: props.required }}
            render={({ field: { onChange, onBlur, value: renderValue } }) => {
                const selectProps = {
                    autoFocus    : props.autoFocus,
                    placeholder  : props.placeholder,
                    isMulti      : props.isMulti,
                    isSearchable : props.isSearchable ? true : props.isSearchable,
                    isClearable  : props.clearable,
                    tabIndex     : props.tabIndex,
                    isDisabled   : props.disabled,
                    value        : renderValue,
                    defaultValue : renderValue,
                    onFocus      : onFocus,
                    options      : suggests,
                    onInputChange: props.loadOptions ? undefined : onInputChange,
                    autoComplete : props.disableAutocomplete ? 'new-password' : 'on',
                    onChange     : (e: IValue) => {
                        onChange(e);
                        props.onChange?.(e);
                    },
                    styles    : getStyles(props, isFocus, !!errors[props.name]),
                    className : cn('input__field'),
                    components: {
                        MultiValueRemove,
                        Input : SelectInput,
                        Option: Option,
                        ...props.components
                    },
                    onBlur: () => {
                        setIsFocus(false);
                        onBlur();
                    }
                };

                return (
                    <label className={cn('input')}>
                        <div
                            className={cn('input__wrapper', `input__wrapper_${props.direction}`, {
                                'input__wrapper_no-label': !props.label
                            })}
                        >
                            {elLabel}
                            {props.loadOptions ? <ReactSelectAsync loadOptions={props.loadOptions} {...selectProps} /> : <ReactSelect {...selectProps} />}
                        </div>
                        {elError}
                    </label>
                );
            }}
        />
    );
};

InputSelect.defaultProps = defaultProps;

export default InputSelect;
