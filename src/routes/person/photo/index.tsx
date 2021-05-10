import React, { useCallback, useState, ChangeEvent } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    alt?: string,
    src?: string,
    isEdit?: boolean
}

export const Photo = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const [src, setSrc] = useState(props.src);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.length) {
            setSrc(URL.createObjectURL(e.target.files?.[0]));
        }
    }, []);

    if(props.isEdit) {
        return (
            <form className={cn('photo')}>
                <label>
                    <img className={cn('photo__image', 'photo__image_edit')} src={src} alt={props.alt} />
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        className={cn('photo__input-file')}
                        onChange={onChange}
                    />
                </label>
            </form>
        );
    }

    return (
        <div className={cn('photo')}>
            <img className={cn('photo__image')} src={src} alt={props.alt} />
        </div>
    );
};

export default Photo;
