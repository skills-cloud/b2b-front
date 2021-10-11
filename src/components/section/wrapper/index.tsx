import React, { ReactNode } from 'react';

import { IStyle, useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface IProps {
    children: ReactNode,
    className?: IStyle | string
}

const Wrapper = ({ children, className }: IProps) => {
    const cn = useClassnames(style, className, true);

    return (
        <div className={cn('wrapper')}>
            {children}
        </div>
    );
};

export default Wrapper;
