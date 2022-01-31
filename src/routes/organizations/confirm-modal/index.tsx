import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { ORGANIZATIONS } from 'helper/url-list';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';
import ErrorsComponent from 'component/error/errors';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    organizationName: string,
    organizationId: string,
    onClickCancel?(): void
}

const ConfirmModal = ({ setVisible, organizationName, organizationId, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();
    const history = useHistory();

    const [deleteOrganization, { error, isError, isLoading }] = mainRequest.useDeleteMainOrganizationMutation();

    const onClickDelete = () => {
        if(organizationId) {
            deleteOrganization({ id: organizationId })
                .unwrap()
                .then(() => {
                    setVisible(false);

                    history.push(ORGANIZATIONS);
                })
                .catch(console.error);
        }
    };

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.organizations.confirm-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.organizations.confirm-modal.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.organizations.confirm-modal.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.organizations.confirm-modal.text', {
                name: organizationName || t('routes.organizations.confirm-modal.empty-name')
            })}
            <ErrorsComponent error={error} isError={isError} isLoading={isLoading} />
        </Modal>
    );
};

export default ConfirmModal;
