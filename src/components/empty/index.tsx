import React, { ReactNode } from 'react';

import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

interface IProps {
    children: ReactNode
}

const Empty = (props: IProps) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('empty')}>
            {props.children}
        </div>
    );
};

export default Empty;
