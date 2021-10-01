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
    const isAncor = to.startsWith('#');

    return (
        <li className={cn('nav__item', {
            'nav__item_selected': selected
        })}
        >
            {isAncor && (
                <a href={to} className={cn('nav__item-link')}>
                    {children}
                </a>
            )}
            {!isAncor && (
                <Link to={to} className={cn('nav__item-link')}>
                    {children}
                </Link>
            )}
        </li>
    );
};

export default NavItem;
