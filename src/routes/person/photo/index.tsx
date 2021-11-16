import React, { useState, ChangeEvent, useMemo } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import { IParams } from 'helper/url-list';

import Loader from 'component/loader';

import { cv } from 'adapter/api/cv';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    alt?: string,
    isEdit?: boolean
}

export const Photo = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { specialistId } = useParams<IParams>();

    const { data, isLoading, isSuccess } = cv.useGetCvByIdQuery({ id: specialistId });
    const [postPhoto, { isLoading: isPostLoading }] = cv.useSetCvPhotoByIdMutation();

    const [src, setSrc] = useState<string | undefined>(data?.photo);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.length) {
            const file = e.target.files?.[0];

            const formData = new FormData();

            formData.set('photo', file);

            postPhoto({
                id  : specialistId,
                data: formData
            })
                .unwrap()
                .then((resp) => {
                    setSrc(resp.photo);
                })
                .catch((err) => {
                    if(!axios.isCancel(err)) {
                        console.error(err);
                    }
                });
        }
    };

    const elLoader = useMemo(() => {
        if(isLoading || isPostLoading) {
            return (
                <div className={cn('photo__loader')}>
                    <Loader />
                </div>
            );
        }
    }, [isLoading, isPostLoading]);

    const elImage = useMemo(() => {
        let photoSrc = src;

        if(isSuccess) {
            if(data?.photo) {
                photoSrc = data.photo;
            } else {
                photoSrc = 'https://avatars.githubusercontent.com/u/8215396?v=4';
            }
        }

        return (
            <img
                className={cn('photo__image', 'photo__image_edit')}
                src={photoSrc || src}
                alt={props.alt}
            />
        );
    }, [data?.photo, isLoading, isPostLoading]);

    if(props.isEdit) {
        return (
            <form className={cn('photo')}>
                <label className={cn('photo__label')}>
                    {elLoader}
                    {elImage}
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        multiple={false}
                        className={cn('photo__input-file')}
                        onChange={onChange}
                    />
                </label>
            </form>
        );
    }

    return (
        <div className={cn('photo')}>
            <img className={cn('photo__image')} src={data?.photo || src} alt={props.alt} />
        </div>
    );
};

export default Photo;
