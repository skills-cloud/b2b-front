import React, { useCallback, useState, ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames, { IStyle } from 'hook/use-classnames';
import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';
import IconFileImage from 'component/icons/file-image';
import style from './index.module.pcss';

export interface IFile {
    name: string,
    type?: string,
    url?: string
}

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Files = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const [list, setList] = useState<Array<IFile>>([{
        name: 'Резюме',
        type: 'application/pdf',
        url : 'https://filebin.net/a0900c3i0uy8jpkg/168725.png'
    }, {
        name: 'Полный список компетенций',
        url : 'https://filebin.net/a0900c3i0uy8jpkg/168725.png'
    }, {
        name: 'Отзыв от работодателя',
        url : 'https://filebin.net/a0900c3i0uy8jpkg/168725.png'
    }, {
        name: 'Сертификат о повышении квалификации',
        type: 'image/png',
        url : 'https://filebin.net/a0900c3i0uy8jpkg/168725.png'
    }]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files: Array<IFile> = [];

        if(e.target.files?.length) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for(let i = 0; i < e.target.files.length; i++) {
                files.push({
                    name: e.target.files[i].name,
                    type: e.target.files[i].type
                });
            }
        }

        setList((state) => [
            ...state,
            ...files
        ]);
    }, []);

    const elFileIcon = useCallback((type?: string) => {
        switch (type) {
            case 'image/png':
            case 'image/jpg':
                return <IconFileImage />;

            case 'application/pdf':
                return <IconFilePdf />;

            default:
                return <IconFileDocument />;
        }
    }, []);

    const elList = useMemo(() => {
        if(list.length) {
            return (
                <ul className={cn('files__list')}>
                    {list.map((item, index) => (
                        <li key={index} className={cn('files__list-item')}>
                            {elFileIcon(item.type)}
                            <a href={item.url} target="_blank" rel="noreferrer">{item.name}</a>
                        </li>
                    ))}
                </ul>
            );
        }
    }, [list]);

    return (
        <div id={props.id} className={cn('files')}>
            <h2 className={cn('files__header')}>{t('routes.person.files.header')}</h2>
            <form className={cn('files__controls')}>
                <label className={cn('files__control')}>
                    <IconPlus />
                    <input
                        type="file"
                        name="file"
                        className={cn('files__input-file')}
                        onChange={onChange}
                    />
                </label>
                <div className={cn('files__control', 'files__control_disable')}>
                    <IconPencil />
                </div>
            </form>
            {elList}
        </div>
    );
};

export default Files;
