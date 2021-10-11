import React, { ReactNode, useCallback, MouseEvent } from 'react';
import { useHover, useLayer } from 'react-laag';
import { useClassnames, IStyle } from 'hook/use-classnames';

export interface IProps {
    children?: ReactNode,
    content?: ReactNode,
    className?: IStyle | string,
    theme?: 'dark' | 'light'
}

import style from './index.module.pcss';

const TooltipError = (props: IProps = { theme: 'light' }) => {
    const cn = useClassnames(style, props.className, true);
    const [isOver, hoverProps] = useHover();
    const {
        triggerProps,
        layerProps,
        renderLayer
    } = useLayer({
        isOpen: isOver,
        auto  : true
    });

    const onClick = useCallback((e: MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <span
            {...triggerProps}
            {...hoverProps}
            onClick={onClick}
            className={cn('tooltip')}
        >
            {props.children}
            {isOver && (
                renderLayer(
                    <div className={cn('tooltip__content', `tooltip__content_${props.theme}`)} {...layerProps}>
                        {props.content}
                    </div>
                )
            )}
        </span>
    );
};

TooltipError.defaultProps = {
    theme: 'light'
};

export default TooltipError;
