import React, { ReactNode, FC, useState, useEffect } from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface INavItem {
    children: ReactNode,
    selected?: boolean,
    replace?: boolean,
    to: string
}

const NavItem: FC<INavItem> = ({ replace, children, to, selected }) => {
    const cn = useClassnames(style);

    const match = useRouteMatch({ path: to });
    const [active, setActive] = useState<boolean>();

    useEffect(() => {
        setActive(match?.isExact);
    }, [match?.isExact]);

    return (
        <li className={cn('nav__item', {
            'nav__item_selected': selected || active
        })}
        >
            <NavLink
                replace={replace}
                to={to}
                isActive={() => match?.isExact || !!selected}
                className={cn('nav__item-link')}
                activeClassName={cn('nav__item-link_active')}
            >
                {children}
            </NavLink>
        </li>
    );
};

export default NavItem;
