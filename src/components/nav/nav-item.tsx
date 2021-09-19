import React, { ReactNode, FC } from 'react';
import { Link } from 'react-router-dom';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface INavItem {
    children: ReactNode,
    selected: boolean,
    to: string
}

const NavItem: FC<INavItem> = ({ children, to, selected }) => {
    const cn = useClassnames(style);

    return (
        <li className={cn('nav__item', {
            'nav__item_selected': selected
        })}
        >
            <Link to={to} className={cn('nav__item-link')}>
                {children}
            </Link>
        </li>
    );
};

export default NavItem;
