import React from 'react';

import style from './index.module.pcss';
import { useClassnames, IStyle } from 'hook/use-classnames';
import IconStar from 'component/icons/star';

interface IProps {
    className?: string | IStyle,
    rating: number,
    onClick?: () => void
}

const StarRating = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);

    return (
        <div className={cn('star-rating', { 'star-rating_hoverable': props.onClick })} onClick={props.onClick}>
            <IconStar
                svg={{
                    className: cn('star-rating__icon', {
                        'star-rating__icon_active-quarter': props.rating >= 1 && props.rating < 2.5,
                        'star-rating__icon_active-half'   : props.rating >= 2.5 && props.rating < 4,
                        'star-rating__icon_active-most'   : props.rating >= 4 && props.rating <= 4.5,
                        'star-rating__icon_active'        : props.rating > 4.5
                    })
                }}
            />
            {props.rating || 0}
        </div>
    );
};

export default StarRating;
