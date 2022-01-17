import React, { useCallback, useState, ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import { IParams } from 'helper/url-list';
import useClassnames, { IStyle } from 'hook/use-classnames';

import IconPlus from 'component/icons/plus';
import IconPencil from 'component/icons/pencil';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';
import IconFileImage from 'component/icons/file-image';
import Modal from 'component/modal';
import IconDelete from 'component/icons/delete';
import Button from 'component/button';
import Empty from 'component/empty';

import { cv } from 'adapter/api/cv';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    id?: string
}

export const Files = (props: IProps) => {
    const { specialistId } = useParams<IParams>();
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const { data } = cv.useGetCvByIdQuery({ id: specialistId });
    const [uploadFile, { isLoading }] = cv.useUploadCvFileByIdMutation();
    const [deleteFile, { isLoading: isLoadingDelete }] = cv.useDeleteCvFileByIdMutation();

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.length) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for(let i = 0; i < e.target.files.length; i++) {
                const formData = new FormData();

                formData.set('file', e.target.files[i]);

                void uploadFile({
                    id  : specialistId,
                    data: formData
                })
                    .unwrap();
            }
        }
    }, []);

    const elFileIcon = useCallback((type?: string) => {
        switch (type) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
            case 'jpg':
            case 'png':
            case 'jpeg':
                return <IconFileImage />;

            case 'application/pdf':
                return <IconFilePdf />;

            default:
                return <IconFileDocument />;
        }
    }, []);

    const elList = useMemo(() => {
        if(data?.files?.length) {
            return (
                <ul className={cn('files__list')}>
                    {data.files.map((item, index) => (
                        <li key={index} className={cn('files__list-item')}>
                            {elFileIcon(item.file_ext)}
                            <a href={item.file} target="_blank" rel="noreferrer">{item.file_name}</a>
                        </li>
                    ))}
                </ul>
            );
        }

        return <Empty>{t('routes.person.files.empty')}</Empty>;
    }, [data?.files]);

    const onClickCancel = () => {
        setIsEdit(false);
    };

    const onClickDelete = (fileId?: number) => () => {
        if(fileId) {
            deleteFile({
                id     : specialistId,
                file_id: String(fileId)
            })
                .unwrap()
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const elFooter = useMemo(() => {
        return (
            <div className={cn('files__form-footer')}>
                <label className={cn('files__control')}>
                    <IconPlus />
                    <input
                        type="file"
                        name="file"
                        className={cn('files__input-file')}
                        onChange={onChange}
                        multiple={true}
                    />
                </label>
                <Button
                    isSecondary={true}
                    onClick={onClickCancel}
                    disabled={isLoadingDelete || isLoading}
                >
                    {t('routes.person.certificates.edit.buttons.cancel')}
                </Button>
                <Button
                    type="submit"
                    disabled={isLoadingDelete || isLoading}
                    isLoading={isLoadingDelete || isLoading}
                >
                    {t('routes.person.certificates.edit.buttons.save')}
                </Button>
            </div>
        );
    }, []);

    const elEditModal = useMemo(() => {
        if(isEdit) {
            return (
                <Modal header={t('routes.person.files.header')} footer={elFooter}>
                    <ul className={cn('files__list')}>
                        {data?.files?.map((item, index) => (
                            <li key={index} className={cn('files__list-item', 'files__list-item_edit')}>
                                {elFileIcon(item.file_ext)}
                                <a className={cn('certificate-edit__item-link')} href={item.file} target="_blank" rel="noreferrer">{item.file_name}</a>
                                <IconDelete
                                    svg={{
                                        className: cn('files__item-control'), onClick: onClickDelete(item.id)
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                </Modal>
            );
        }
    }, [isEdit, data?.files]);

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
                        multiple={true}
                    />
                </label>
                <div
                    className={cn('files__control')}
                    onClick={() => {
                        setIsEdit(true);
                    }}
                >
                    <IconPencil />
                </div>
            </form>
            {elList}
            {elEditModal}
        </div>
    );
};

export default Files;
