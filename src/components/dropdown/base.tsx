import React, { ReactNode, useState, useRef } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.pcss';

export interface IItem {
    elem: ReactNode,
    onClick?: () => void,
    to?: string
}

export interface IProps {
    className?: string | IStyle,
    align?: 'top' | 'bottom' | 'right' | 'left',
    children: ReactNode,
    activatorElement: ReactNode,
    onOutsideClick?: () => void
}

const Dropdown = ({ children, className, align = 'bottom', activatorElement, onOutsideClick }: IProps) => {
    const cn = useClassnames(style, className, true);
    const [open, setOpen] = useState<boolean>();
    const styles: {top?: string, bottom?: string} = {};

    switch (align) {
        case 'top':
            styles.bottom = '0';
            break;
        case 'bottom':
            styles.top = '0';
            break;
    }


    return (
        <OutsideClickHandler onOutsideClick={() => {
            setOpen(false);
            onOutsideClick?.();
        }}
        >
            <div className={cn('dropdown')}>
                <div
                    className={cn('dropdown__activator')} onClick={() => {
                        setOpen(!open);
                    }}
                >
                    {activatorElement}
                </div>
                {open && (
                    <div className={cn('dropdown__content')} style={styles}>
                        {children}
                    </div>
                )}
            </div>
        </OutsideClickHandler>
    );
};

export default Dropdown;
