import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { IParams, ORGANIZATION_PROJECT_MODULE_REQUEST_ID, REQUEST_ID } from 'helper/url-list';


import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { RequestRead } from 'adapter/types/main/request/id/get/code-200';

import ProjectRequestForm from '../form';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields: RequestRead,
    onClickCancel?: () => void
}

const FORM_MAIN_ID = 'FORM_MAIN_ID';

const EditModal = ({ setVisible, fields, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { organizationId, moduleId, projectId, requestId } = useParams<IParams>();

    const onClickBack = () => {
        if(onClickCancel) {
            onClickCancel();
        } else {
            if(organizationId && moduleId && projectId) {
                history.push(ORGANIZATION_PROJECT_MODULE_REQUEST_ID(organizationId, projectId, moduleId, requestId));
            } else {
                history.push(REQUEST_ID(requestId));
            }
        }
    };

    return (
        <Modal
            onClose={() => {
                setVisible(false);
                onClickBack();
            }}
            header={t('routes.project-request.blocks.edit-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);
                            onClickBack();
                        }}
                    >
                        {t('routes.project-request.blocks.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={FORM_MAIN_ID}>
                        {t('routes.project-request.blocks.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <ProjectRequestForm
                formId={FORM_MAIN_ID}
                onSuccess={() => {
                    setVisible(false);
                    onClickBack();
                }}
                defaultValues={fields}
            />
        </Modal>
    );
};

export default EditModal;
