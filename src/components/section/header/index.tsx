import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import { H1 } from 'component/header';
import Dropdown, { IItem } from 'component/dropdown';

import style from './index.module.pcss';

export interface IProps {
    dropdownActions?: Array<IItem>,
    actions?: ReactNode,
    children: ReactNode
}

const SectionHeader = ({ children, dropdownActions, actions }: IProps) => {
    const cn = useClassnames(style);

    const elActions = () => {
        if(dropdownActions) {
            return (
                <Dropdown
                    className={cn('section__header-actions')}
                    items={dropdownActions}
                />
            );
        }

        return <div className={cn('section__header-actions')}>{actions}</div>;
    };

    return (
        <div className={cn('section__header-wrapper')}>
            <H1>{children}</H1>
            {elActions()}
        </div>
    );
};

export default SectionHeader;
