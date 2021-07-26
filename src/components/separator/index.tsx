import React from 'react';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

const Separator = () => {
    const cn = useClassnames(style);

    return <div className={cn('separator')} />;
};

export default Separator;
