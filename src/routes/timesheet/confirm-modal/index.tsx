import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    timeSheetId: string,
    timeSheetName?: string,
    onClickCancel?(): void
}

const ConfirmModal = ({ setVisible, timeSheetId, timeSheetName, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();

    const [deleteMainTimeSheetRowById] = mainRequest.useDeleteMainTimeSheetRowByIdMutation();

    const onClickDelete = () => {
        if(timeSheetId) {
            deleteMainTimeSheetRowById({ id: timeSheetId })
                .unwrap()
                .then(() => {
                    setVisible(false);
                })
                .catch(console.error);
        }
    };

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.timesheet.confirm-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.timesheet.confirm-modal.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.timesheet.confirm-modal.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.timesheet.confirm-modal.text', {
                name: timeSheetName || t('routes.timesheet.confirm-modal.empty-name')
            })}
        </Modal>
    );
};

export default ConfirmModal;
