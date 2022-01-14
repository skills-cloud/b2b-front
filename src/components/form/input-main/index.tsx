import React, { useState, FC, ReactNode, MouseEvent, useEffect, useMemo } from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';
import ReactSelect, { components, OptionTypeBase } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, Message, useFormContext } from 'react-hook-form';
import { ValidationRule } from 'react-hook-form/dist/types/validator';

import { useClassnames, IStyle } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

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

export enum ERequestType {
    Organization,
    Customer,
    Contractor,
    IsCustomer,
    Project,
    RequestType,
    FunPointType
}

const methods = {
    [ERequestType.Organization]: {
        single: mainRequest.endpoints.getMainOrganizationById,
        list  : mainRequest.endpoints.getMainOrganization
    },
    [ERequestType.Customer]: {
        single: mainRequest.endpoints.getMainOrganizationCustomerById,
        list  : mainRequest.endpoints.getMainOrganizationCustomer
    },
    [ERequestType.Contractor]: {
        single: mainRequest.endpoints.getMainOrganizationContractorById,
        list  : mainRequest.endpoints.getMainOrganizationContractor
    },
    [ERequestType.IsCustomer]: {
        single: mainRequest.endpoints.getMainOrganizationIsCustomerById,
        list  : mainRequest.endpoints.getMainOrganizationIsCustomer
    },
    [ERequestType.Project]: {
        single: mainRequest.endpoints.getMainOrganizationProjectById,
        list  : mainRequest.endpoints.getMainOrganizationProjectList
    },
    [ERequestType.RequestType]: {
        single: mainRequest.endpoints.getMainRequestTypeById,
        list  : mainRequest.endpoints.getMainRequestType
    },
    [ERequestType.FunPointType]: {
        single: mainRequest.endpoints.getMainFunPointTypeById,
        list  : mainRequest.endpoints.getMainFunPointType
    }
};

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
    defaultValue?: Array<IValue | number | string>,
    error?: TError,
    requestLimit?: number,
    requestOffset?: number,
    elError?: boolean,
    isMulti?: boolean,
    requestType: ERequestType,
    onChange?(value: IValue): void,
    onCreateOption?(value: string): void,
    isRefetch?: boolean,
    onRefetchSuccess?(value: boolean): void
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

const InputMain = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors }, watch, trigger, control, setValue } = useFormContext();
    const dispatch = useDispatch();

    const [isFocus, setIsFocus] = useState(false);
    const [options, setOptions] = useState<Array<IValue>>();
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

    useEffect(() => {
        const method = methods[props.requestType].list.initiate(undefined);

        dispatch(method)
            .then(({ data: loadData }) => {
                if(loadData?.results?.length) {
                    const res = loadData.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    setOptions(res);

                    if(props.isRefetch) {
                        props.onRefetchSuccess?.(false);
                    }
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [props.isRefetch]);

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
                const baseMethod = methods[props.requestType];

                if(baseMethod.single) {
                    Promise.all(ids.map((item) => {
                        const method = baseMethod.single.initiate({
                            id: String(item)
                        });

                        return dispatch(method)
                            .then((resp) => ({
                                label: resp.data?.name || '',
                                value: String(resp.data?.id) || ''
                            }));
                    }))
                        .then((resp: Array<IValue>) => {
                            setValue(props.name, resp, { shouldDirty: true });

                            if(props.isRefetch) {
                                props.onRefetchSuccess?.(false);
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }
            } else if(values.length) {
                setValue(props.name, values, { shouldDirty: values.some((item) => !!item) });
            }
        }
    }, []);

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
            placeholder   : props.placeholder,
            autoFocus     : props.autoFocus,
            isMulti       : props.isMulti,
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

InputMain.requestType = ERequestType;

InputMain.defaultProps = defaultProps;

export default InputMain;
