import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

interface ISectionContentList {
    children: ReactNode
}

const SectionContentList = ({ children }: ISectionContentList) => {
    const cn = useClassnames(style);

    return <div className={cn('section__content-list')}>{children}</div>;
};

export default SectionContentList;
