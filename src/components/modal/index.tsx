import React, { ReactNode, useEffect, useMemo } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconClose from 'component/icons/close';
import IconArrowLeft from 'component/icons/arrow-left-full';
import Header from 'component/header';

import style from './index.module.pcss';

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

    const onOutsideClick = () => {
        props.onClose?.();
    };

    const escClick = (e: KeyboardEvent) => {
        if(e.key === 'Escape') {
            props.onClose?.();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', escClick, false);

        return () => {
            document.removeEventListener('keydown', escClick, false);
        };
    }, []);

    const elHeader = useMemo(() => {
        if(typeof props.header === 'string') {
            return <Header level={1} tag="h2">{props.header}</Header>;
        }

        return props.header;
    }, [props.header]);

    return (
        <div className={cn('modal')}>
            <div className={cn('modal__content')}>
                <OutsideClickHandler onOutsideClick={onOutsideClick}>
                    <div className={cn('modal__body')}>
                        <div className={cn('modal__header-wrapper', {
                            'modal__header-wrapper_with-back' : !!props.onBack,
                            'modal__header-wrapper_with-close': !!props.onClose
                        })}
                        >
                            {!!props.onBack && (
                                <button
                                    type="button"
                                    className={cn('modal__button', 'modal__button_back')}
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
                                    <IconClose svg={{ className: cn('modal__icon-close') }} />
                                </button>
                            ) }
                        </div>
                        {props.children}
                    </div>
                    {props.footer && (
                        <div className={cn('modal__footer')}>
                            {props.footer}
                        </div>
                    )}
                </OutsideClickHandler>
            </div>
        </div>
    );
};

export default Modal;
