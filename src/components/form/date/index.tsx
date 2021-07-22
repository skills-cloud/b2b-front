import React, { useMemo, useEffect, ReactNode, Fragment } from 'react';
import { useFormContext, Controller, Message } from 'react-hook-form';
import { ValidationRule } from 'react-hook-form/dist/types/validator';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import { ErrorMessage } from '@hookform/error-message';

import { IStyle, useClassnames } from 'hook/use-classnames';
import Error from 'component/error';
import IconCalendar from 'component/icons/calendar';

import style from './index.module.pcss';

export interface IProps {
    name: string,
    className?: IStyle | string,
    direction?: 'row' | 'column',
    minDate?: number | string,
    maxDate?: number | string,
    placeholder?: string,
    label?: ReactNode,
    required?: Message | ValidationRule<boolean>,
    tabIndex?: number,
    disabled?: boolean,
    isErrorTootip?: boolean,
    elError?: boolean,
    dataQA?: string,
    defaultValue?: string
}

const APPLE_DEVICE = /iPad|iPhone|iPod/;
const isChrome = navigator.userAgent.includes('Chrome');
const isSafari = navigator.userAgent.includes('Safari');
const isMozilla = navigator.userAgent.includes('Mozilla');

const isSafariDesktop = !APPLE_DEVICE.test(navigator.userAgent) && isSafari && !isChrome;

const DateInput = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { formState: { errors }, watch, trigger, register, control } = useFormContext();
    const direction = useMemo(() => props.direction || 'row', [props.direction]);
    const value = watch(props.name);

    const elLabel = useMemo(() => {
        if(props.label) {
            return (
                <strong
                    className={cn('date__label', {
                        'date__label_required': props.required
                    })}
                >
                    {props.label}
                </strong>
            );
        }
    }, [props.label, props.required, errors[props.name], props.isErrorTootip]);

    const elError = useMemo(() => {
        if(props.elError !== false && !props.isErrorTootip) {
            return <ErrorMessage as={Error} elIcon={true} name={props.name} errors={errors} className={cn('date__error')} />;
        }
    }, [props.elError, props.name, errors[props.name], props.isErrorTootip]);

    const elPlaceholder = useMemo(() => {
        if(props.placeholder && !value) {
            return <span className={cn('date__input-placeholder')}>{props.placeholder}</span>;
        }
    }, [value, props.placeholder]);

    useEffect(() => {
        if(value || props.defaultValue) {
            void trigger(props.name);
        }
    }, [value, props.defaultValue]);

    const elInput = () => {
        if(isSafariDesktop || isMozilla && !isChrome) {
            return (
                <Controller
                    name={props.name}
                    control={control}
                    defaultValue={props.defaultValue}
                    rules={{ required: props.required }}
                    render={({ field }) => (
                        <Fragment>
                            <DatePicker
                                minDate={props.minDate ? new Date(props.minDate) : undefined}
                                maxDate={props.maxDate ? new Date(props.maxDate) : undefined}
                                selected={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => {
                                    if(date && !Array.isArray(date)) {
                                        field.onChange(moment(date).format('YYYY-MM-DD'));
                                    }
                                }}
                                placeholderText={props.placeholder}
                                className={cn('date__input')}
                                value={props.defaultValue}
                            />
                            <IconCalendar svg={{ className: cn('date__icon') }} />
                        </Fragment>
                    )}
                />
            );
        }

        return (
            <Fragment>
                <input
                    type="date"
                    lang="en"
                    className={cn('date__input', {
                        'date__input_filled' : !!value,
                        'date__input_invalid': errors[props.name]
                    })}
                    defaultValue={props.defaultValue}
                    min={props.minDate}
                    max={props.maxDate}
                    {...register(props.name, {
                        required: props.required
                    })}
                />
                <IconCalendar svg={{ className: cn('date__icon') }} />
                {elPlaceholder}
            </Fragment>
        );
    };

    return (
        <div className={cn('date', `date_${direction}`)}>
            {elLabel}
            <div className={cn('date__input-wrapper')}>
                {elInput()}
            </div>
            {elError}
        </div>
    );
};

export default DateInput;
