import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import { H1 } from 'component/header';
import style from './index.module.pcss';

const SectionHeader = ({ children, actions }: { children: ReactNode, actions?: ReactNode }) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('section__header-wrapper')}>
            <H1>{children}</H1>
            {actions}
        </div>
    );
};

export default SectionHeader;
