import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface ISectionContentListItem {
    children?: ReactNode,
    title: ReactNode
}

const SectionContentListItem = ({ children, title }: ISectionContentListItem) => {
    const cn = useClassnames(style);

    if(!children) {
        return null;
    }

    return (
        <div className={cn('section__content-list-item')}>
            <div>{ title }</div>
            <div>{ children }</div>
        </div>
    );
};

export default SectionContentListItem;
