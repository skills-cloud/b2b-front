import React, { ReactNode } from 'react';
// import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Modal from 'component/modal';
import Button from 'component/button';
import Error from 'component/error';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    onClose?(): void,
    onSubmit?(): void,
    cancelButtonText?: string,
    mainButtonText?: string,
    title?: ReactNode,
    text?: ReactNode,
    isLoading?: boolean,
    isError?: boolean,
    error?: ReactNode
}

// @TODO Translate
export const ConfirmDialog = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    // const { t } = useTranslation();

    return (
        <Modal header={props.title} onClose={props.onClose}>
            <div className={cn('confirm-dialog')}>
                {props.text && <p className={cn('confirm-dialog__text')}>{props.text}</p>}
                <div className={cn('confirm-dialog__buttons')}>
                    <Button isSecondary={true} onClick={props.onClose}>{props.cancelButtonText || 'Отмена'}</Button>
                    <Button
                        onClick={props.onSubmit}
                        isLoading={props.isLoading}
                        disabled={props.isLoading}
                    >
                        {props.mainButtonText || 'Подтвердить'}
                    </Button>
                </div>
                {props.isError && (
                    <Error>{props.error}</Error>
                )}
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
