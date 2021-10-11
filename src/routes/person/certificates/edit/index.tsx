import React, { MouseEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import { IconDelete } from 'component/icons/delete';
import IconPencil from 'component/icons/pencil';
import EditForm from 'route/person/certificates/edit/form';

import { certificate } from 'adapter/api/certificate';
import { CvCertificateRead } from 'adapter/types/cv/certificate/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    fields?: Array<CvCertificateRead>,
    onCancel?(): void,
    onSubmit?(): void
}

export const CertificatesEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { specialistId } = useParams<{ specialistId: string }>();

    const [itemToRemove, setItemToRemove] = useState<CvCertificateRead | null>(null);
    const [itemToEdit, setItemToEdit] = useState<CvCertificateRead | Record<string, unknown> | null>(null);

    const { data, refetch } = certificate.useGetCertificateListQuery({ cv_id: specialistId });
    const [deleteCertificate] = certificate.useDeleteCertificateByIdMutation();

    const onClickDelete = (result: CvCertificateRead) => () => {
        setItemToRemove(result);
    };

    const onClickEdit = (result: CvCertificateRead) => () => {
        setItemToEdit(result);
    };

    const onClickAppend = (e: MouseEvent) => {
        e.preventDefault();

        setItemToEdit({});
    };

    const onCancelEditDelete = () => {
        setItemToEdit(null);
        setItemToRemove(null);
    };

    const onSubmitCertificates = () => {
        refetch();
        onCancelEditDelete();
    };

    const onDeleteItem = () => {
        if(itemToRemove) {
            const indexOfItemToRemove = props.fields?.findIndex((item) => item.id === itemToRemove.id);

            if(indexOfItemToRemove && itemToRemove.id) {
                deleteCertificate({
                    id: itemToRemove.id
                })
                    .unwrap()
                    .then(() => {
                        setItemToRemove(null);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                setItemToRemove(null);
            }
        }
    };

    const elControls = useMemo(() => {
        return (
            <div className={cn('certificate-edit__controls')}>
                <Button
                    type="button"
                    onClick={onDeleteItem}
                >
                    {t('routes.person.certificates.confirm.confirm')}
                </Button>
                <Button
                    type="button"
                    isSecondary={true}
                    className={cn('certificate-edit__modal-close')}
                    onClick={onCancelEditDelete}
                >
                    {t('routes.person.certificates.confirm.cancel')}
                </Button>
            </div>
        );
    }, [itemToRemove]);

    const elSubmitButton = useMemo(() => {
        if(itemToRemove || itemToEdit) {
            return <Button type="submit">{t('routes.person.certificates.edit.buttons.save')}</Button>;
        }

        return <Button type="button" onClick={props.onCancel}>{t('routes.person.certificates.edit.buttons.done')}</Button>;
    }, [itemToRemove, itemToEdit]);

    const elContent = () => {
        if(itemToRemove) {
            return (
                <Modal
                    header={t('routes.person.certificates.confirm.title')}
                    className={cn('certificate-edit__confirm')}
                    footer={elControls}
                >
                    {null}
                </Modal>
            );
        }

        if(itemToEdit) {
            return <EditForm field={itemToEdit as CvCertificateRead} onCancel={onCancelEditDelete} onSubmit={onSubmitCertificates} />;
        }

        return (
            <div className={cn('certificate-edit__content')}>
                <div className={cn('certificate-edit__content-body')}>
                    <h2 className={cn('certificate-edit__header')}>{t('routes.person.certificates.header')}</h2>
                    {data?.results.map((result) => (
                        <div key={result.id} className={cn('certificate-edit__item')}>
                            <div className={cn('certificate-edit__item-description')}>
                                <h5 className={cn('certificate-edit__item-description-title')}>{result.name}</h5>
                                <p className={cn('certificate-edit__item-description-text')}>{result.education_place?.name}</p>
                            </div>
                            <div className={cn('certificate-edit__item-controls')}>
                                <IconDelete svg={{ className: cn('certificate-edit__item-control'), onClick: onClickDelete(result) }} />
                                <IconPencil svg={{ className: cn('certificate-edit__item-control'), onClick: onClickEdit(result) }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={cn('certificate-edit__form-footer')}>
                    <a
                        href="#append"
                        className={cn('certificate-edit__link-append')}
                        children={t('routes.person.certificates.edit.buttons.append')}
                        onClick={onClickAppend}
                    />
                    {itemToEdit || itemToRemove && (
                        <Button isSecondary={true} onClick={props.onCancel}>
                            {t('routes.person.certificates.edit.buttons.cancel')}
                        </Button>
                    )}
                    {elSubmitButton}
                </div>
            </div>
        );
    };

    return (
        <div className={cn('certificate-edit')}>
            {elContent()}
        </div>
    );
};

export default CertificatesEdit;
