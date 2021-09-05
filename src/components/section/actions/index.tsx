import React, { ButtonHTMLAttributes, ReactNode } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';
import style from './index.module.pcss';

export interface IAction<T> extends Omit<ButtonHTMLAttributes <T>, 'className'> {
    children: ReactNode,
    className?: string | IStyle
}

const Action = ({ children, className, ...rest }: IAction<HTMLButtonElement>) => {
    const cn = useClassnames(style, className, true);

    return (
        <button {...rest} type="button" className={cn('action')}>
            {children}
        </button>
    );
};

export default Action;
