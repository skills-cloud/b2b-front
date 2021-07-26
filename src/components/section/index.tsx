import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import Header from './header';
import style from './index.module.pcss';

interface ISection {
    title?: string,
    children: ReactNode,
    withoutPaddings?: boolean
}

const Section = ({ title, children, withoutPaddings = false }: ISection) => {
    const cn = useClassnames(style);

    return (
        <div
            className={cn('section', {
                'section_without-paddings': withoutPaddings
            })}
        >
            {title && <Header>{title}</Header>}
            {children}
        </div>
    );
};

export default Section;
