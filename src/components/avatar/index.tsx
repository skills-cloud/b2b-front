import React, { MouseEvent, useMemo } from 'react';
import { Link } from 'react-router-dom';

import useClassnames from 'hook/use-classnames';

import style from './index.module.pcss';

export interface IProps {
    src?: string | null,
    to?: string,
    title?: string,
    className?: string,
    onClick?(e: MouseEvent): void,
    preset?: 'small'
}

export const Avatar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const attrs = {
        onClick  : props.onClick,
        className: cn('avatar', {
            'avatar_small': props.preset === 'small'
        })
    };

    const elPhoto = useMemo(() => {
        if(props.src) {
            return <img src={props.src} alt={props.title} {...attrs} />;
        }
    }, [props.src, props.title]);

    if(props.to) {
        return (
            <Link to={props.to} title={props.title} {...attrs}>
                {elPhoto}
            </Link>
        );
    }

    return elPhoto || null;
};

export default Avatar;
