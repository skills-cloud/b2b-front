import React, { ReactNode } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.module.pcss';

interface IProps {
    children: ReactNode,
    className?: IStyle | string,
    textPosition?: 'left' | 'center' | 'right'
}

export const defaultProps = {
    textPosition: 'center'
};

const Empty = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);

    return (
        <div
            className={cn('empty', {
                [`empty_${props.textPosition}`]: props.textPosition
            })}
        >
            {props.children}
        </div>
    );
};

Empty.defaultProps = defaultProps

export default Empty;
