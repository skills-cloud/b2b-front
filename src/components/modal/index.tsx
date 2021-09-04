import React, { ReactNode, useMemo } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconeClose from 'component/icons/close';
import IconArrowLeft from 'component/icons/arrow-left-full';
import Header from 'component/header';

import style from './index.module.pcss';
import { JS_CLASS } from './use-modal-close';

export interface IProps {
    className?: string | IStyle,
    header?: ReactNode,
    footer?: ReactNode,
    children: ReactNode,
    onClose?: () => void,
    onBack?: () => void
}

export const Modal = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    const elHeader = useMemo(() => {
        if(typeof props.header === 'string') {
            return <Header level={1} tag="h2">{props.header}</Header>;
        }

        return props.header;
    }, [props.header]);

    return (
        <div className={cn('modal')}>
            <div className={cn('modal__content', { [`${JS_CLASS}`]: true })}>
                <div className={cn('modal__body')}>
                    <div className={cn('modal__header-wrapper', {
                        'modal__header-wrapper_with-back' : !!props.onBack,
                        'modal__header-wrapper_with-close': !!props.onClose
                    })}
                    >
                        {!!props.onBack && (
                            <button
                                type="button"
                                onClick={props.onBack}
                            >
                                <IconArrowLeft
                                    svg={{ className: cn('modal__icon-back') }}
                                />
                            </button>
                        )}
                        {elHeader}
                        {!!props.onClose && (
                            <button
                                type="button"
                                className={cn('modal__button')}
                                onClick={props.onClose}
                            >
                                <IconeClose svg={{ className: cn('modal__icon-close') }} />
                            </button>
                        ) }
                    </div>
                    {props.children}
                </div>
                {props.footer && <div className={cn('modal__footer')}>{props.footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
