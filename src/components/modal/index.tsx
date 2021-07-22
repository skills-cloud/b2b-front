import React, { ReactNode } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    header?: ReactNode,
    footer?: ReactNode,
    children: ReactNode
}

export const Modal = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    return (
        <div className={cn('modal')}>
            <div className={cn('modal__content')}>
                <div className={cn('modal__body')}>
                    <h2 className={cn('modal__header')}>{props.header}</h2>
                    {props.children}
                </div>
                <div className={cn('modal__footer')}>
                    {props.footer}
                </div>
            </div>
        </div>
    );
};

export default Modal;
