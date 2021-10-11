import React, { FC, HTMLAttributes, ReactNode } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

interface IDropdownMenuItem extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode,
    selected: boolean
}

const DropdownMenuItem: FC<IDropdownMenuItem> = ({ children, selected, ...props }) => {
    const cn = useClassnames(style);

    return (
        <div
            {...props} className={cn('dropdown-menu-item', {
                'dropdown-menu-item_selected': selected
            })}
        >
            {children}
        </div>
    );
};

export default DropdownMenuItem;