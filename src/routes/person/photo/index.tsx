import React, { useState, ChangeEvent, useEffect } from 'react';

import useClassnames, { IStyle } from 'hook/use-classnames';

import style from './index.module.pcss';
import { postAccWhoAmISetPhoto } from 'adapter/api/acc';
import { useCancelToken } from 'hook/cancel-token';
import axios from 'axios';

export interface IProps {
    className?: string | IStyle,
    alt?: string,
    src?: string,
    isEdit?: boolean
}

export const Photo = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const token = useCancelToken();
    const [src, setSrc] = useState(props.src);

    useEffect(() => {
        return () => {
            token.remove();
        };
    }, []);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.length) {
            const file = e.target.files?.[0];

            const formData = new FormData();

            formData.set('photo', file);

            postAccWhoAmISetPhoto({
                data       : formData,
                cancelToken: token.new()
            })
                .then((resp) => {
                    setSrc(resp.photo);
                    console.log('RESP', resp);
                })
                .catch((err) => {
                    if(!axios.isCancel(err)) {
                        console.error(err);
                    }
                });
        }
    };

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

Photo.defaultProps = {
    src: 'https://avatars.githubusercontent.com/u/8215396?v=4'
};

export default Photo;
