import { ReactNode } from 'react';
import { IStyle } from 'hook/use-classnames';

export type TError = string | null;

export interface IValue {
    label: string,
    value: string | number
}

export interface IProps {
    className?: string | IStyle,
    name: string,
    direction?: 'row' | 'column',
    required?: boolean,
    children?: ReactNode,
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
    elError?: boolean
}
