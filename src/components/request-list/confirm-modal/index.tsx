import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    requestId: string,
    requestName?: string,
    onClickCancel?(): void
}

const ConfirmModal = ({ setVisible, requestId, requestName, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();
    const history = useHistory();

    const [deleteMainRequestById] = mainRequest.useDeleteMainRequestByIdMutation();

    const onClickDelete = () => {
        if(requestId) {
            deleteMainRequestById({ id: requestId })
                .unwrap()
                .then(() => {
                    history.push('/project-request');
                    setVisible(false);
                })
                .catch(console.error);
        }
    };

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.project-request.blocks.confirm-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.project-request.blocks.confirm-modal.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.project-request.blocks.confirm-modal.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.project-request.blocks.confirm-modal.text', {
                name: requestName || t('routes.project-request.blocks.confirm-modal.empty-name')
            })}
        </Modal>
    );
};

export default ConfirmModal;
