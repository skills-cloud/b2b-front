import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import OrganizationProjectCreateForm from 'route/organization-projects/form';

import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields: OrganizationProjectRead
}

const FORM_MAIN_ID = 'ORGANIZATION_PROJECT_FORM_MAIN_ID';

const EditModal = ({ setVisible, fields }: IEditModal) => {
    const { t } = useTranslation();

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.organization-project.edit-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);
                        }}
                    >
                        {t('routes.organization-project.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={FORM_MAIN_ID}>
                        {t('routes.organization-project.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <OrganizationProjectCreateForm
                formId={FORM_MAIN_ID}
                onSuccess={() => {
                    setVisible(false);
                }}
                defaultValues={fields}
            />
        </Modal>
    );
};

export default EditModal;
