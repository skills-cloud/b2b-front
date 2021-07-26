import React, { ReactNode } from 'react';
import style from './index.module.pcss';
import { useClassnames } from 'hook/use-classnames';

export interface IPageCentered {
    children: ReactNode
}

const PageCentered = ({ children }: IPageCentered) => {
    const cn = useClassnames(style);

    return <div className={cn('page-centred')}>{children}</div>;
};

export default PageCentered;
