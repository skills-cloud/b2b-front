import React, { ReactNode } from 'react';
import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface ISidebarLayout {
    children: ReactNode,
    sidebar?: ReactNode
}

const SidebarLayout = ({ children, sidebar }: ISidebarLayout) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('sidebar-layout', { 'sidebar-layout_alone': !sidebar })}>
            <main className={cn('sidebar-layout__main')}>{children}</main>
            {sidebar && <aside className={cn('sidebar-layout__aside')}>{sidebar}</aside>}
        </div>
    );
};

export default SidebarLayout;
