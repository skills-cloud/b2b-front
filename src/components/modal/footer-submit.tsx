import React, { ReactNode } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './footer-submit.module.pcss';

interface IFooterSubmit {
    children: ReactNode
}

const FooterSubmit = ({ children }: IFooterSubmit) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('modal-footer-submit')}>
            {children}
        </div>
    );
};

export default FooterSubmit;
