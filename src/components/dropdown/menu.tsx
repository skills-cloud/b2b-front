import React, { ReactNode } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

interface IDropdownMenu {
    children: ReactNode
}

const DropdownMenu = ({ children }: IDropdownMenu) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('dropdown-menu')}>{children}</div>
    );
};

export default DropdownMenu;