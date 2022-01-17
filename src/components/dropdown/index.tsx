import React, { ReactNode, useState, useRef, useEffect } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.module.pcss';

export interface IItem {
    elem: ReactNode,
    onClick?: () => void,
    to?: string
}

export interface IProps {
    className?: string | IStyle,
    align?: 'bottom',
    render: ({ onClose }: {onClose: () => void}) => ReactNode,
    children: ReactNode,
    onOutsideClick?: () => void
}

const Dropdown = ({ render, className, align = 'bottom', children, onOutsideClick }: IProps) => {
    const cn = useClassnames(style, className, true);
    const activatorRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>();
    const [styles, setStyles] = useState<{top?: number}>({});

    useEffect(() => {
        if(visible && activatorRef.current) {
            switch (align) {
                case 'bottom':
                    setStyles({
                        top: activatorRef.current.clientHeight + 20
                    });
                    break;
            }
        }
    }, [visible, align]);


    return (
        <OutsideClickHandler onOutsideClick={() => {
            setVisible(false);
            onOutsideClick?.();
        }}
        >
            <div className={cn('dropdown')}>
                <div
                    ref={activatorRef}
                    className={cn('dropdown__activator')} onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setVisible(!visible);
                    }}
                >
                    {children}
                </div>
                {visible && (
                    <div
                        className={cn('dropdown__content')} style={styles} onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}
                    >
                        {render({ onClose: () => setVisible(false) })}
                    </div>
                )}
            </div>
        </OutsideClickHandler>
    );
};

export default Dropdown;
