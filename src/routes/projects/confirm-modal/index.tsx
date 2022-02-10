import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { PROJECTS } from 'helper/url-list';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';
import ErrorsComponent from 'component/error/errors';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    projectName: string,
    projectId: string,
    onClickCancel?(): void
}

const ConfirmModal = ({ setVisible, projectName, projectId, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();
    const history = useHistory();

    const [deleteProject, { error, isError, isLoading }] = mainRequest.useDeleteMainOrganizationProjectMutation();

    const onClickDelete = () => {
        if(projectId) {
            deleteProject({ id: projectId })
                .unwrap()
                .then(() => {
                    setVisible(false);

                    history.push(PROJECTS);
                })
                .catch(console.error);
        }
    };

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.projects.confirm-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.projects.confirm-modal.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.projects.confirm-modal.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.projects.confirm-modal.text', {
                name: projectName || t('routes.projects.confirm-modal.empty-name')
            })}
            <ErrorsComponent error={error} isError={isError} isLoading={isLoading} />
        </Modal>
    );
};

export default ConfirmModal;
