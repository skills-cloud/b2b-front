import React, { useState, FC, ReactNode, MouseEvent, useEffect, useMemo } from 'react';
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue';
import { components, OptionTypeBase } from 'react-select';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from 'lodash.debounce';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

import { useClassnames, IStyle } from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

import Error from 'component/error';
import IconClose from 'component/icons/close';

import { dictionary } from 'adapter/api/dictionary';

import getStyles from './style';
import style from './index.module.pcss';

export type TError = string | null;

export interface IValue {
    label: string,
    value: string | number | null
}

export enum ERequestType {
    City,
    Country,
    Citizenship,
    Position,
    IndustrySector,
    EducationGraduate,
    EducationPlace,
    EducationSpeciality,
    TypeOfEmployment,
    Competence
}

const methods = {
    [ERequestType.City]: {
        single: dictionary.endpoints.getCityById,
        multi : undefined,
        list  : dictionary.endpoints.getCityList
    },
    [ERequestType.Country]: {
        single: dictionary.endpoints.getCountryById,
        multi : undefined,
        list  : dictionary.endpoints.getCountryList
    },
    [ERequestType.Citizenship]: {
        single: dictionary.endpoints.getCitizenshipById,
        multi : undefined,
        list  : dictionary.endpoints.getCitizenshipList
    },
    [ERequestType.Position]: {
        single: dictionary.endpoints.getPositionById,
        multi : undefined,
        list  : dictionary.endpoints.getPositionList
    },
    [ERequestType.IndustrySector]: {
        single: dictionary.endpoints.getIndustrySectorById,
        multi : undefined,
        list  : dictionary.endpoints.getIndustrySector
    },
    [ERequestType.EducationGraduate]: {
        single: dictionary.endpoints.getEducationGraduateById,
        multi : undefined,
        list  : dictionary.endpoints.getEducationGraduate
    },
    [ERequestType.EducationPlace]: {
        single: dictionary.endpoints.getEducationPlaceById,
        multi : undefined,
        list  : dictionary.endpoints.getEducationPlace
    },
    [ERequestType.EducationSpeciality]: {
        single: dictionary.endpoints.getEducationSpecialityById,
        multi : undefined,
        list  : dictionary.endpoints.getEducationSpeciality
    },
    [ERequestType.TypeOfEmployment]: {
        single: dictionary.endpoints.getTypeOfEmploymentById,
        multi : undefined,
        list  : dictionary.endpoints.getTypeOfEmployment
    },
    [ERequestType.Competence]: {
        single: undefined,
        multi : dictionary.endpoints.getCompetence,
        list  : dictionary.endpoints.getCompetence
    }
};

export interface IProps {
    className?: string | IStyle,
    name: string,
    direction?: 'row' | 'column',
    required?: boolean,
    label?: ReactNode,
    createable?: boolean,
    autoFocus?: boolean,
    clearable?: boolean,
    placeholder?: string,
    tabIndex?: string,
    disabled?: boolean,
    defaultValue?: Array<IValue | number | string | null> | null,
    error?: TError,
    requestLimit?: number,
    requestOffset?: number,
    elError?: boolean,
    requestType: ERequestType,
    isMulti?: boolean,
    onChange?(value: IValue): void
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

const InputDictionary = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors }, watch, trigger, control, setValue } = useFormContext();
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

            const pushToArrays = (arrayItem: number | string | IValue | null) => {
                if(arrayItem !== null) {
                    if(typeof arrayItem === 'number' || typeof arrayItem === 'string') {
                        ids.push(arrayItem);
                    } else {
                        values.push(arrayItem);
                    }
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
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else if(baseMethod.multi) {
                    dispatch(baseMethod.multi.initiate({ id: ids as Array<number> }))
                        .then(({ data }) => {
                            const newValue = data?.results?.map((item) => ({
                                value: item?.id,
                                label: item?.name
                            }));

                            setValue(props.name, newValue, { shouldDirty: true });
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

    const onLoadOptions = debounce((search_string: string, callback) => {
        const params: { search?: string } = {};

        if(search_string) {
            params.search = search_string;
        }

        const method = methods[props.requestType].list.initiate(params);

        dispatch(method)
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
            isDisabled    : props.disabled,
            cacheOptions  : true,
            defaultOptions: true,
            components    : { MultiValueRemove, MultiValue, Option, Input: SelectInput },
            styles        : getStyles(props, isFocus),
            className     : cn('input__field', {
                'input__field_invalid': errors[props.name]
            })
        };

        if(props.createable) {
            return <AsyncCreatableSelect {...selectProps} loadOptions={onLoadOptions} />;
        }

        return <AsyncSelect {...selectProps} loadOptions={onLoadOptions} />;
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

InputDictionary.requestType = ERequestType;

InputDictionary.defaultProps = defaultProps;

export default InputDictionary;
