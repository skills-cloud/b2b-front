import React, { ReactNode } from 'react';

import { useClassnames } from 'hook/use-classnames';
import { H1 } from 'component/header';
import Dropdown from 'component/dropdown';
import DropdownMenu from 'component/dropdown/menu';
import DotsAction from 'component/section/actions/dots';

import style from './index.module.pcss';
import DropdownMenuItem from 'component/dropdown/menu-item';

export interface IProps {
    dropdownActions?: ReactNode | Array<ReactNode>,
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
                    render={() => (
                        <DropdownMenu>
                            {Array.isArray(dropdownActions) ? (
                                dropdownActions?.map((item, index) => (
                                    <DropdownMenuItem key={index} selected={false}>
                                        {item}
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem selected={false}>
                                    {dropdownActions}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenu>
                    )}
                >
                    <DotsAction />
                </Dropdown>
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
