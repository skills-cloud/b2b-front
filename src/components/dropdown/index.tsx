import React, { ReactNode, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { Link } from 'react-router-dom';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.pcss';
import IconDots from 'component/icons/dots';

export interface IItem {
    elem: ReactNode,
    onClick?: () => void,
    to?: string
}

export interface IProps {
    className?: string | IStyle,
    items?: Array<IItem>,
    top?: string,
    left?: string,
    right?: string,
    onOutsideClick?: () => void
}

const Dropdown = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const [open, setOpen] = useState<boolean>();

    const onClickDots = () => {
        setOpen((oldState) => !oldState);
    };

    const onOutsideClick = () => {
        setOpen(false);

        props.onOutsideClick?.();
    };

    const elContent = () => {
        if(open) {
            return (
                <div className={cn('dropdown__content')} style={{ top: props.top, left: props.left, right: props.right }}>
                    {props.items?.map((item, i) => {
                        if(item.to) {
                            return (
                                <Link
                                    className={cn('dropdown__item')}
                                    key={i}
                                    to={item.to}
                                >
                                    {item.elem}
                                </Link>
                            );
                        }

                        return (
                            <div className={cn('dropdown__item')} key={i} onClick={item.onClick}>{item.elem}</div>
                        );
                    })}
                </div>
            );
        }
    };

    return (
        <OutsideClickHandler onOutsideClick={onOutsideClick}>
            <div className={cn('dropdown')}>
                <IconDots
                    svg={{
                        onClick  : onClickDots,
                        className: cn('dropdown__icon')
                    }}
                />
                {elContent()}
            </div>
        </OutsideClickHandler>
    );
};

export default Dropdown;
