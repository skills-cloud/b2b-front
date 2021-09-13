import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import { H1 } from 'component/header';
import Dropdown, { IItem } from 'component/dropdown';

import style from './index.module.pcss';

export interface IProps {
    actions?: Array<IItem>,
    children: ReactNode
}

const SectionHeader = ({ children, actions }: IProps) => {
    const cn = useClassnames(style);

    const elActions = () => {
        if(actions) {
            return (
                <Dropdown
                    className={cn('section__header-actions')}
                    items={actions}
                />
            );
        }

        return null;
    };

    return (
        <div className={cn('section__header-wrapper')}>
            <H1>{children}</H1>
            {elActions()}
        </div>
    );
};

export default SectionHeader;
