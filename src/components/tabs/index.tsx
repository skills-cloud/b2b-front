import React, { ReactNode } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';
import Tab from './tab';

interface ITabs {
    children: ReactNode
}

const Tabs = ({ children }: ITabs) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('tabs')}>
            {children}
        </div>
    );
};

export { Tab };
export default Tabs;
