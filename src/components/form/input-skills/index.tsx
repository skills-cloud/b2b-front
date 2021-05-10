import React, { useState, FC, ReactNode, MouseEvent, useEffect, useMemo } from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from 'lodash.debounce';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';

import Error from 'component/error';
import IconClose from 'component/icons/close';

import { IProps, IValue } from './types';
import style from './index.module.pcss';

import MOCK from './skills.json';

// eslint-disable-next-line @typescript-eslint/ban-types
const MultiValueRemove: FC<MultiValueRemoveProps<{}>> = (props) => {
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

const InputSkills = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors }, watch, trigger, control } = useFormContext();

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
        Promise.resolve(MOCK)
            .then((payload) => {
                const result = payload.skills.map((item) => ({
                    label: item.name,
                    value: item.id
                }));

                callback(result);
            })
            .catch(() => {
                callback(null);
            });
    }, 150);

    const elLabel = (): ReactNode => {
        if(props.children) {
            return (
                <strong
                    className={cn('input__label', {
                        'input__label_required': props.required
                    })}
                >
                    {props.children}
                </strong>
            );
        }
    };

    const elError = useMemo(() => {
        if(props.elError !== false) {
            return <ErrorMessage as={Error} name={props.name} errors={errors} className={cn('input__error')} />;
        }
    }, [props.elError, props.name, errors[props.name]]);

    const elInput = (renderValue: string, onChange: () => void, onBlur: () => void): ReactNode => {
        const selectProps = {
            onFocus,
            onBlur,
            onChange,
            value       : renderValue,
            defaultValue: renderValue,
            placeholder : props.placeholder,
            autoFocus   : props.autoFocus,
            isMulti     : true,
            isClearable : props.clearable,
            tabIndex    : props.tabIndex,
            cacheOption : true,
            isDisabled  : props.disabled,
            loadOptions : onLoadOptions,
            components  : { MultiValueRemove, MultiValue, Option, Input: SelectInput },
            className   : cn('input__field', {
                'input__field_invalid': errors[props.name]
            }),
            styles: {
                placeholder: () => ({
                    fontFamily: 'Roboto',
                    color     : '#a9a9a9',
                    fontSize  : '14px',
                    position  : 'absolute',
                    top       : '50%',
                    lineHeight: '40px',
                    marginTop : '-20px',
                    marginLeft: '4px'
                }),
                container: () => ({
                    fontFamily  : 'Roboto',
                    border      : 'solid 1px #d9d9d9',
                    borderRadius: '4px',
                    flexGrow    : 1,
                    minHeight   : '40px',
                    boxSizing   : 'border-box',
                    position    : 'relative',
                    borderColor : isFocus ? '#f7b322' : '#d9d9d9',
                    boxShadow   : isFocus ? '0 0 0 1px #f7b322' : 'none'
                }),
                control: () => ({
                    alignItems     : 'center',
                    backgroundColor: props.disabled ? 'rgba(224, 224, 224, 0.25)' : '#fff',
                    display        : 'flex',
                    flexWrap       : 'wrap',
                    justifyContent : 'center',
                    outline        : 'none',
                    position       : 'relative',
                    transition     : 'all 100ms',
                    minHeight      : '38px',
                    borderRadius   : '4px'
                }),
                multiValue: () => ({
                    display        : 'block',
                    height         : '24px',
                    lineHeight     : '24px',
                    backgroundColor: 'rgba(0, 112, 233, 0.15)',
                    fontSize       : '12px',
                    padding        : '0 24px 0 10px',
                    color          : '#0070e9',
                    whiteSpace     : 'nowrap',
                    overflow       : 'hidden',
                    textOverflow   : 'ellipsis',
                    borderRadius   : '12px',
                    textAlign      : 'center',
                    fontWeight     : 500,
                    position       : 'relative',
                    margin         : '1px 3px'
                }),
                multiValueLabel : () => ({}),
                multiValueRemove: () => ({
                    borderRadius   : '50%',
                    backgroundColor: '#fff',
                    fill           : '#0070e9',
                    boxSizing      : 'border-box',
                    position       : 'absolute',
                    right          : '4px',
                    top            : '4px',
                    bottom         : '4px',
                    cursor         : 'pointer',
                    padding        : '4px'
                })
            }
        };

        if(props.createable) {
            // @ts-ignore
            return <AsyncCreatableSelect {...selectProps} />;
        }

        // @ts-ignore
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

InputSkills.defaultProps = {
    direction: 'row'
};

export default InputSkills;
