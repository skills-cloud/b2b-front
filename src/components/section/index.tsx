import React, { ReactNode } from 'react';

import { IStyle, useClassnames } from 'hook/use-classnames';
import Header from './header';
import style from './index.module.pcss';

interface ISection {
    title?: string,
    children: ReactNode,
    withoutPaddings?: boolean,
    className?: IStyle | string,
    id?: string
}

const Section = ({ id, title, children, withoutPaddings = false, className }: ISection) => {
    const cn = useClassnames(style, className, true);

    return (
        <section
            id={id}
            className={cn('section', {
                'section_without-paddings': withoutPaddings
            })}
        >
            {title && <Header>{title}</Header>}
            {children}
        </section>
    );
};

export default Section;
