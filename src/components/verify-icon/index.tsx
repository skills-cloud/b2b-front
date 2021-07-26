import React, { ReactNode, useMemo } from 'react';

import { IStyle, useClassnames } from 'hook/use-classnames';

import IconApply from 'component/icons/apply';
import TooltipError from 'component/tooltip';
import IconWarning from 'component/icons/warning';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    isVerify?: boolean,
    tooltip?: string | ReactNode
}

const VerifyIcon = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    const elIcon = useMemo(() => {
        if(props.isVerify) {
            return (
                <IconApply
                    svg={{
                        width    : 24,
                        height   : 24,
                        className: cn('verify-icon__apply')
                    }}
                />
            );
        }

        return (
            <IconWarning
                svg={{
                    width    : 24,
                    height   : 24,
                    className: cn('verify-icon__warning')
                }}
            />
        );
    }, [props.isVerify]);

    if(props.tooltip) {
        return (
            <TooltipError content={props.tooltip}>
                {elIcon}
            </TooltipError>
        );
    }

    return (
        <div className={cn('verify-icon')}>
            {elIcon}
        </div>
    );
};

export default VerifyIcon;
