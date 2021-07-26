import React, { useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';

import { IStyle, useClassnames } from 'hook/use-classnames';
import Avatar from 'component/avatar';

import style from './index.module.pcss';

export interface IProps {
    className?: IStyle | string,
    titleTo?: string,
    title?: string,
    subTitle?: string,
    avatar: {
        src?: string,
        to?: string,
        preset?: 'small'
    }
}

const UserAvatar = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    const elSubTitle = useMemo(() => {
        if(props.subTitle) {
            return <span>{props.subTitle}</span>;
        }
    }, [props.subTitle]);

    const elContent = useMemo(() => {
        return (
            <Fragment>
                <Avatar {...props.avatar} to={props.titleTo ? undefined : props.avatar.to} />
                {props.title}
                {elSubTitle}
            </Fragment>
        );
    }, [props.title, JSON.stringify(props.avatar), props.subTitle]);

    if(props.titleTo) {
        return (
            <Link to={props.titleTo} className={cn('user-avatar')}>
                {elContent}
            </Link>
        );
    }

    return (
        <div className={cn('user-avatar')}>
            {elContent}
        </div>
    );
};

export default UserAvatar;
