import React, { ReactNode } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconeClose from 'component/icons/close';
import Header from 'component/header';

import style from './index.module.pcss';
import { JS_CLASS } from './use-modal-close';

export interface IProps {
    className?: string | IStyle,
    header?: ReactNode,
    footer?: ReactNode,
    children: ReactNode,
    onClose?: () => void
}

export const Modal = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    return (
        <div className={cn('modal')}>
            <div className={cn('modal__content', { [`${JS_CLASS}`]: true })}>
                <div className={cn('modal__body')}>
                    <div className={cn('modal__header-wrapper')}>
                        <Header level={1} tag="h2">{props.header}</Header>
                        {!!props.onClose && (
                            <button
                                type="button"
                                className={cn('modal__button-close')}
                                onClick={props.onClose}
                            >
                                <IconeClose svg={{ className: cn('modal__icon-close') }} />
                            </button>
                        ) }
                    </div>
                    {props.children}
                </div>
                <div className={cn('modal__footer')}>{props.footer}</div>
            </div>
        </div>
    );
};

export default Modal;
