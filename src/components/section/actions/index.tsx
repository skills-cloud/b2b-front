import React, { ButtonHTMLAttributes, ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface IAction<T> extends ButtonHTMLAttributes<T> {
    children: ReactNode
}

const Action = ({ children, ...rest }: IAction<HTMLButtonElement>) => {
    const cn = useClassnames(style);

    return (
        <button {...rest} type="button" className={cn('action')}>
            {children}
        </button>
    );
};

export default Action;
