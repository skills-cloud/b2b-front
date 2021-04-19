import React, { ReactNode, FC, useCallback, MouseEvent } from 'react';
import { Arrow, useHover, useLayer } from 'react-laag';
import { useClassnames, IStyle } from 'hook/use-classnames';

export interface IProps {
    children?: ReactNode,
    content?: ReactNode,
    className?: IStyle | string
}

import style from './index.module.pcss';

const TooltipError: FC<IProps> = (props) => {
    const cn = useClassnames(style, props.className, true);
    const [isOver, hoverProps] = useHover();
    const {
        triggerProps,
        layerProps,
        arrowProps,
        renderLayer
    } = useLayer({
        isOpen: isOver
    });

    const onClick = useCallback((e: MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <span
            {...triggerProps}
            {...hoverProps}
            onClick={onClick}
        >
            {props.children}
            {isOver && (
                renderLayer(
                    <div className={cn('tooltip')} {...layerProps}>
                        {props.content}
                        <Arrow
                            {...arrowProps}
                            size={6}
                            angle={45}
                            roundness={1}
                            borderWidth={1}
                            borderColor="rgba(0, 0, 0, 0.25)"
                            backgroundColor="white"
                        />
                    </div>
                )
            )}
        </span>
    );
};

export default TooltipError;
