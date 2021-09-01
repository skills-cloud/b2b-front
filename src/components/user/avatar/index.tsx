import React, { useMemo, Fragment, ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { IStyle, useClassnames } from 'hook/use-classnames';
import Avatar from 'component/avatar';

import style from './index.module.pcss';

export interface IProps {
    className?: IStyle | string,
    titleTo?: string,
    title?: ReactNode,
    subTitle?: string,
    titleTarget?: '_blank' | '_self',
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

    const elTitle = useMemo(() => {
        if(props.title) {
            const attrs = {
                className: cn('mini-info__title'),
                children : props.title
            };

            if(props.titleTo) {
                return <Link {...attrs} to={props.titleTo} target={props.titleTarget || undefined} />;
            }

            if(typeof props.title !== 'string') {
                return <div {...attrs} />;
            }

            return <strong {...attrs} />;
        }
    }, [props.title, props.titleTo, props.titleTarget]);

    const elContent = useMemo(() => {
        return (
            <Fragment>
                <Avatar {...props.avatar} to={props.avatar.to || props.titleTo} />
                {elTitle}
                {elSubTitle}
            </Fragment>
        );
    }, [props.title, JSON.stringify(props.avatar), props.subTitle]);

    if(props.titleTo) {
        return (
            <div className={cn('user-avatar')}>
                {elContent}
            </div>
        );
    }

    return (
        <div className={cn('user-avatar')}>
            {elContent}
        </div>
    );
};

export default UserAvatar;
