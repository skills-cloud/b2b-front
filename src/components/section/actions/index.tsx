import React, { ButtonHTMLAttributes, Fragment, ReactNode, useMemo } from 'react';
import { LocationDescriptor } from 'history';
import { Link } from 'react-router-dom';

import useClassnames, { IStyle } from 'hook/use-classnames';
import style from './index.module.pcss';

export interface IAction<T> extends Omit<ButtonHTMLAttributes <T>, 'className'> {
    children: ReactNode,
    className?: string | IStyle,
    to?: LocationDescriptor,
    disableBackground?: boolean,
    label?: ReactNode
}

const Action = ({ children, className, disableBackground, label, to, ...rest }: IAction<HTMLButtonElement | HTMLAnchorElement>) => {
    const cn = useClassnames(style, className, true);

    const actionClassName = useMemo(() => {
        return cn('action', { 'action_label': label });
    }, [className, label]);

    const elLabel = useMemo(() => {
        if(label) {
            return label;
        }
    }, [label]);

    const elContent = useMemo(() => {
        return (
            <Fragment>
                <span
                    className={cn('action__content', {
                        'action__content_no-bg': disableBackground
                    })}
                >
                    {children}
                </span>
                {elLabel}
            </Fragment>
        );
    }, [children, label]);

    if(to) {
        return (
            <Link to={to} className={actionClassName} {...rest}>
                {elContent}
            </Link>
        );
    }

    return (
        <button {...rest} type="button" className={actionClassName}>
            {elContent}
        </button>
    );
};

export default Action;
