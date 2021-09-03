import React, { useState, FC, ReactNode, MouseEvent, useEffect, useMemo } from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';
import { components, OptionTypeBase } from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from 'lodash.debounce';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

import Error from 'component/error';
import IconClose from 'component/icons/close';

import { dictionary } from 'adapter/api/dictionary';

import { IProps, IValue } from './types';
import getStyles from './style';
import style from './index.module.pcss';

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

const InputCitizenship = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors }, watch, trigger, control } = useFormContext();
    const dispatch = useDispatch();

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

    useEffect((): void => {
        const initValue = props.defaultValue;

        if(initValue) {
            const ids: Array<number | string> = [];
            const values: Array<IValue> = [];

            const pushToArrays = (arrayItem: number | string | IValue) => {
                if(typeof arrayItem === 'number' || typeof arrayItem === 'string') {
                    ids.push(arrayItem);
                } else {
                    values.push(arrayItem);
                }
            };

            if(Array.isArray(initValue)) {
                for(const item of initValue) {
                    pushToArrays(item);
                }
            } else {
                pushToArrays(initValue);
            }

            if(ids.length) {
                // TODO API request
            }
        }
    }, []);

    const onFocus = (): void => {
        if(!isFocus) {
            setIsFocus(true);
        }
    };

    const onLoadOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getCitizenshipList.initiate({
            search: search_string
        }))
            .then(({ data: loadData }) => {
                if(loadData?.results?.length) {
                    const res = loadData.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    callback(res);
                } else {
                    callback(null);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, 150);

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

    const elInput = (renderValue: OptionTypeBase, onChange: (e: IValue) => void, onBlur: () => void): ReactNode => {
        const selectProps = {
            onFocus,
            onBlur,
            onChange: (e: IValue) => {
                onChange(e);
                props.onChange?.(e);
            },
            value       : renderValue,
            defaultValue: renderValue,
            placeholder : props.placeholder,
            autoFocus   : props.autoFocus,
            isMulti     : false,
            isClearable : props.clearable,
            tabIndex    : props.tabIndex,
            cacheOption : true,
            isDisabled  : props.disabled,
            loadOptions : onLoadOptions,
            components  : { MultiValueRemove, MultiValue, Option, Input: SelectInput },
            className   : cn('input__field', {
                'input__field_invalid': errors[props.name]
            }),
            styles: getStyles(props, isFocus)
        };

        if(props.createable) {
            return <AsyncCreatableSelect {...selectProps} />;
        }

        return <AsyncSelect {...selectProps} />;
    };

    return (
        <Controller
            name={props.name}
            control={control}
            defaultValue={props.defaultValue}
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

InputCitizenship.defaultProps = {
    direction: 'row'
};

export default InputCitizenship;
