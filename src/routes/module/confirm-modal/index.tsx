import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';

import { IParams, ORGANIZATION_PROJECT_ID } from 'helper/url-list';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Error from 'component/error';

import { mainRequest } from 'adapter/api/main';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    moduleName?: string,
    onClickCancel?(): void
}

const ConfirmModal = ({ setVisible, moduleName, onClickCancel }: IEditModal) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { organizationId, moduleId, projectId } = useParams<IParams>();

    const [error, setError] = useState<string | null>(null);

    const [deleteModule] = mainRequest.useDeleteMainModuleByIdMutation();

    const onClickDelete = () => {
        if(moduleId) {
            setError(null);

            deleteModule({ id: moduleId })
                .unwrap()
                .then(() => {
                    setVisible(false);

                    history.push(ORGANIZATION_PROJECT_ID(organizationId, projectId));
                })
                .catch((err) => {
                    setError(err.data?.details?.[0]);
                });
        }
    };

    const elError = useMemo(() => {
        if(error) {
            return <Error elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.module.confirm.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);

                            onClickCancel?.();
                        }}
                    >
                        {t('routes.module.confirm.cancel')}
                    </Button>
                    <Button onClick={onClickDelete}>
                        {t('routes.module.confirm.delete')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            {t('routes.module.confirm.text', {
                name: moduleName || t('routes.module.confirm.empty-name')
            })}
            {elError}
        </Modal>
    );
};

export default ConfirmModal;
