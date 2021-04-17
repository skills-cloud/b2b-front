import React, { ReactNode, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { useClassnames } from 'hook/use-classnames';
import Loader from 'component/loader';

import { IProps } from './types';
import style from './index.module.pcss';

const Button = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    const elChildren = (): ReactNode => {
        if(props.isLoading) {
            return (
                <div className={cn('button__loader')}>
                    <Loader className={cn('button__loader-icon')} />
                </div>
            );
        }

        return props.children;
    };

    const onClick = (e: MouseEvent): void => {
        if(props.onClick) {
            props.onClick(e);
        }
    };

    const params = {
        className: cn('button', {
            'button_secondary': props.isSecondary
        }),
        children: elChildren(),
        tabIndex: props.tabIndex,
        style   : props.style,
        rel     : props.target === '_blank' ? 'noopener noreferrer' : undefined,
        onClick
    };

    if(props.href) {
        return <a href={props.href} target={props.target} {...params} />;
    } else if(props.to) {
        return <Link to={props.to} target={props.target} {...params} />;
    }

    return (
        <button
            type={props.type}
            disabled={props.disabled || props.isLoading}
            {...params}
        />
    );
};

Button.defaultProps = {
    disabled : false,
    isLoading: false,
    type     : 'button'
};

export default Button;
