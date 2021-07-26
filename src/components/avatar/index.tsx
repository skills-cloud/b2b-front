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

const defaultProps = {
    src: 'https://avatars.githubusercontent.com/u/8215396?v=4'
};

export const Avatar = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style, props.className, true);
    const attrs = {
        onClick  : props.onClick,
        className: cn('avatar', {
            'avatar_small': props.preset === 'small'
        })
    };

    const elPhoto = useMemo(() => {
        return <img src={props.src} alt={props.title} {...attrs} />;
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

Avatar.defaultProps = defaultProps;

export default Avatar;
