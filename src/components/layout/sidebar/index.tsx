import React, { ReactNode } from 'react';
import style from './index.module.pcss';
import { useClassnames } from 'hook/use-classnames';

interface ISidebarLayout {
    children: ReactNode,
    sidebar: ReactNode
}

const SidebarLayout = ({ children, sidebar }: ISidebarLayout) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('page')}>
            <main className={cn('main')}>{children}</main>
            <aside className={cn('aside')}>{sidebar}</aside>
        </div>
    );
};

export default SidebarLayout;
