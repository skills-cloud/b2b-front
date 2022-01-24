import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { acc } from 'adapter/api/acc';
import Error from 'component/error';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    userId?: number,
    userName?: string,
    onClickCancel?(): void
}

const ConfirmModal = ({ setVisible, userId, userName, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();

    const [deleteMainRequestById, { isLoading, isError, error }] = acc.useDeleteUserManageMutation();

    const onClickDelete = () => {
        if(userId) {
            deleteMainRequestById({ id: String(userId) })
                .unwrap()
                .then(() => {
                    setVisible(false);
                })
                .catch(console.error);
        }
    };

    const elErrors = useMemo(() => {
        const errors = error as {
            data: {
                details: Record<string, Array<string>> | string
            }
        };

        if(errors?.data?.details && typeof errors?.data?.details !== 'string') {
            const keys = Object.keys(errors.data.details);

            return (
                <div>
                    {keys.map((key) => {
                        if(typeof errors?.data?.details?.[key] === 'string') {
                            return <Error key={key}>{`${key}: ${errors?.data?.details?.[key]}`}</Error>;
                        }

                        return (errors?.data?.details as Record<string, Array<string>>)?.[key]?.map((message, index) => (
                            <Error key={`${key}-${index}}`}>{message}</Error>
                        ));
                    })}
                </div>
            );
        }

        return <Error>{errors?.data?.details}</Error>;
    }, [isError, isLoading, error]);

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.system-users.confirm-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.system-users.confirm-modal.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.system-users.confirm-modal.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.system-users.confirm-modal.text', {
                name: userName || t('routes.system-users.confirm-modal.empty-name')
            })}
            {elErrors}
        </Modal>
    );
};

export default ConfirmModal;
