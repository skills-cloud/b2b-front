import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Error from 'component/error';

import { mainRequest } from 'adapter/api/main';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    funPointName?: string,
    funPointId: string,
    onClickCancel?(): void,
    onSuccess?(): void
}

const ConfirmModalDeleteFunPoint = ({ setVisible, funPointId, funPointName, onClickCancel, onSuccess }: IEditModal) => {
    const { t } = useTranslation();

    const [error, setError] = useState<string | null>(null);

    const [deleteModuleFunPoint] = mainRequest.useDeleteMainModuleFunPointByIdMutation();

    const onClickDelete = () => {
        setError(null);

        deleteModuleFunPoint({ id: String(funPointId) })
            .unwrap()
            .then(() => {
                setVisible(false);

                onSuccess?.();
            })
            .catch((err) => {
                setError(err?.message);
                console.error(err);
            });
    };

    const elError = useMemo(() => {
        if(error) {
            return <Error elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.fun-points.confirm-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.fun-points.confirm-modal.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.fun-points.confirm-modal.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.fun-points.confirm-modal.text', {
                name: funPointName || t('routes.fun-points.confirm-modal.empty-name')
            })}
            {elError}
        </Modal>
    );
};

export default ConfirmModalDeleteFunPoint;
