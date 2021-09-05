import { ReactNode } from 'react';
import { Message } from 'react-hook-form';
import { SelectComponentsConfig, OptionsType } from 'react-select';

import { IStyle } from 'hook/use-classnames';
import { ValidationRule } from 'react-hook-form/dist/types/validator';

export type TError = string | null;

export interface IValue {
    label: string,
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any
}

export interface ICommon {
    className?: string | IStyle,
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Partial<SelectComponentsConfig<any, false>>,
    required?: Message | ValidationRule<boolean>,
    direction?: 'row' | 'column',
    clearable?: boolean,
    defaultValue?: Array<IValue | number | string>,
    label?: ReactNode,
    autoFocus?: boolean,
    isSearchable?: boolean,
    placeholder?: string,
    tabIndex?: string,
    disabled?: boolean,
    elError?: boolean,
    isMulti?: boolean,
    onChange?(value: IValue): void
}

export interface IAsyncSelect extends ICommon {
    options?: Array<IValue>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadOptions(q: string, callback: (value: OptionsType<any>) => void): void
}

export interface ISelect extends ICommon {
    options: Array<IValue>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadOptions?(q: string, callback: (value: OptionsType<any>) => void): void
}

export type TProps = IAsyncSelect | ISelect;
