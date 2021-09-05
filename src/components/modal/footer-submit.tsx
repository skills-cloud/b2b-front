import React, { ReactNode } from 'react';
import useClassnames from 'hook/use-classnames';

import style from './footer-submit.module.pcss';

interface IFooterSubmit {
    children: ReactNode,
    withAction?: boolean
}

const FooterSubmit = ({ children, withAction }: IFooterSubmit) => {
    const cn = useClassnames(style);

    return (
        <div className={cn('modal-footer-submit', { 'modal-footer-submit_with-action': withAction })}>
            {children}
        </div>
    );
};

export default FooterSubmit;
