import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

enum EKinds {
    Base = 'base',
    Secondary = 'secondary',
}

const Tag = ({
    children,
    kind = EKinds.Base
}: {
    children: ReactNode,
    kind: EKinds
}) => {
    const cn = useClassnames(style);

    return <div className={cn('tag', `tag_${kind}`)}>{children}</div>;
};

Tag.kinds = EKinds;

export default Tag;
