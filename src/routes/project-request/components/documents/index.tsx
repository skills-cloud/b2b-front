import React, { ReactNode, MouseEvent } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

export interface IProps {
    onClick(e: MouseEvent): void,
    children: ReactNode
}

const Base = (props: IProps) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('base')} onClick={props.onClick}>
            {props.children}
        </div>
    );
};

export default Base;
