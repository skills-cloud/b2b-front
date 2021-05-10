import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';
import IconFileImage from 'component/icons/file-image';
import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Files = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    return (
        <div id={props.id} className={cn('files')}>
            <h1 className={cn('files__header')}>{t('routes.person.files.header')}</h1>
            <form className={cn('files__controls')}>
                <label className={cn('files__control')}>
                    <IconPlus />
                    <input type="file" name="file" className={cn('files__input-file')} />
                </label>
                <div className={cn('files__control', 'files__control_disable')}>
                    <IconPencil />
                </div>
            </form>
            <ul className={cn('files__list')}>
                <li className={cn('files__list-item')}>
                    <IconFilePdf />
                    <a href="https://filebin.net/a0900c3i0uy8jpkg/168725.png" target="_blank" rel="noreferrer">Резюме</a>
                </li>
                <li className={cn('files__list-item')}>
                    <IconFileDocument />
                    <a href="https://filebin.net/a0900c3i0uy8jpkg/168725.png" target="_blank" rel="noreferrer">Полный список компетенций</a>
                </li>
                <li className={cn('files__list-item')}>
                    <IconFileDocument />
                    <a href="https://filebin.net/a0900c3i0uy8jpkg/168725.png" target="_blank" rel="noreferrer">Отзыв от работодателя</a>
                </li>
                <li className={cn('files__list-item')}>
                    <IconFileImage />
                    <a href="https://filebin.net/a0900c3i0uy8jpkg/168725.png" target="_blank" rel="noreferrer">Сертификат о повышении квалификации</a>
                </li>
            </ul>
        </div>
    );
};

export default Files;
