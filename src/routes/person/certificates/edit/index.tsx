import React, { Fragment, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import useClassnames, { IStyle } from 'hook/use-classnames';
import Button from 'component/button';
import Modal from 'component/modal';
import { IconDelete } from 'component/icons/delete';
import IconPencil from 'component/icons/pencil';
import EditForm, { CERT_EDIT_FORM } from 'route/person/certificates/edit/form';

import { certificate } from 'adapter/api/certificate';
import { CvCertificateRead } from 'adapter/types/cv/certificate/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    className?: string | IStyle,
    fields?: Array<CvCertificateRead>,
    onCancel?(): void,
    onSubmit?(): void
}

enum ESteps {
    List,
    DetailForm,
    DeleteForm,
}

export const CertificatesEdit = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const { specialistId } = useParams<{ specialistId: string }>();

    const [step, setStep] = useState<ESteps>(ESteps.List);
    const [certificateItem, setCertificateItem] = useState<CvCertificateRead | null>(null);

    const { data, refetch } = certificate.useGetCertificateListQuery({ cv_id: specialistId });
    const [deleteCertificate, { isLoading }] = certificate.useDeleteCertificateByIdMutation();

    const backToList = () => {
        setCertificateItem(null);
        setStep(ESteps.List);
    };

    const onClickDelete = (result: CvCertificateRead) => () => {
        setStep(ESteps.DeleteForm);
        setCertificateItem(result);
    };

    const onClickEdit = (result: CvCertificateRead) => () => {
        setStep(ESteps.DetailForm);
        setCertificateItem(result);
    };

    const onClickAppend = (e: MouseEvent) => {
        e.preventDefault();

        setStep(ESteps.DetailForm);
        setCertificateItem(null);
    };

    const onSubmitCertificates = () => {
        refetch();
        backToList();
    };

    const onDeleteItem = () => {
        if(certificateItem) {
            const indexOfItemToRemove = props.fields?.findIndex((item) => item.id === certificateItem.id);

            if(indexOfItemToRemove !== undefined && certificateItem.id) {
                deleteCertificate({
                    id: certificateItem.id
                })
                    .unwrap()
                    .then(() => {
                        setCertificateItem(null);
                        setStep(ESteps.List);
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            } else {
                setCertificateItem(null);
            }
        }
    };

    const elContent = () => {
        if(step === ESteps.DetailForm) {
            return (
                <EditForm
                    field={certificateItem as CvCertificateRead}
                    onCancel={backToList}
                    onSubmit={onSubmitCertificates}
                />
            );
        }

        if(step === ESteps.List) {
            return (
                <div className={cn('certificate-edit__content-body')}>
                    {data?.results.map((result) => (
                        <div key={result.id} className={cn('certificate-edit__item')}>
                            <div className={cn('certificate-edit__item-description')}>
                                <h5 className={cn('certificate-edit__item-description-title')}>{result.name}</h5>
                                <p className={cn('certificate-edit__item-description-text')}>{result.education_place?.name}</p>
                            </div>
                            <div className={cn('certificate-edit__item-controls')}>
                                <IconPencil
                                    svg={{
                                        className: cn('certificate-edit__item-control'),
                                        onClick  : onClickEdit(result)
                                    }}
                                />
                                <IconDelete
                                    svg={{
                                        className: cn('certificate-edit__item-control'),
                                        onClick  : onClickDelete(result)
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    const elFooter = () => {
        let content = (
            <Fragment>
                <a
                    href="#append"
                    className={cn('certificate-edit__link-append')}
                    children={t('routes.person.certificates.edit.buttons.append')}
                    onClick={onClickAppend}
                />
                <Button onClick={props.onCancel}>
                    {t('routes.person.certificates.edit.buttons.done')}
                </Button>
            </Fragment>
        );

        if(step === ESteps.DeleteForm) {
            content = (
                <Fragment>
                    <Button
                        type="button"
                        onClick={onDeleteItem}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {t('routes.person.certificates.confirm.confirm')}
                    </Button>
                    <Button
                        type="button"
                        isSecondary={true}
                        disabled={isLoading}
                        className={cn('certificate-edit__modal-close')}
                        onClick={backToList}
                    >
                        {t('routes.person.certificates.confirm.cancel')}
                    </Button>
                </Fragment>
            );
        }

        if(step === ESteps.DetailForm) {
            content = (
                <Fragment>
                    <Button
                        isSecondary={true}
                        onClick={props.onCancel}
                    >
                        {t('routes.person.certificates.edit.buttons.cancel')}
                    </Button>
                    <Button type="submit" form={CERT_EDIT_FORM}>
                        {t('routes.person.certificates.edit.buttons.save')}
                    </Button>
                </Fragment>
            );
        }

        return (
            <div
                className={cn('certificate-edit__form-footer', {
                    'certificate-edit__form-footer_short': step === ESteps.DeleteForm || step === ESteps.DetailForm
                })}
            >
                {content}
            </div>
        );
    };

    const elHeader = () => {
        if(step === ESteps.DeleteForm) {
            return t('routes.person.certificates.confirm.title');
        }

        if(step === ESteps.DetailForm && certificateItem) {
            return certificateItem?.name;
        }

        return t('routes.person.certificates.header');
    };

    return (
        <Modal
            header={elHeader()}
            footer={elFooter()}
            onBack={step !== ESteps.List ? backToList : undefined}
        >
            {elContent()}
        </Modal>
    );
};

export default CertificatesEdit;
