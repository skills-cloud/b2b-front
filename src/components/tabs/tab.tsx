import React, { ReactNode } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

interface ITab {
    children: ReactNode,
    active: boolean,
    onClick: () => void
}

const Tab = ({ children, active, ...props }: ITab) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('tabs__nav-item', { 'tabs__nav-item_active': active })} {...props}>
            {children}
        </div>
    );
};

export default Tab;
