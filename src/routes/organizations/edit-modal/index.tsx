import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';

import { Organization } from 'adapter/types/main/organization/get/code-200';

import OrganizationCreateForm from '../form';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields: Organization
}

const FORM_MAIN_ID = 'FORM_MAIN_ID';

const EditModal = ({ setVisible, fields }: IEditModal) => {
    const { t } = useTranslation();

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.organization.blocks.edit-modal.header')}
            footer={
                <ModalFooterSubmit>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);
                        }}
                    >
                        {t('routes.organization.blocks.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={FORM_MAIN_ID}>
                        {t('routes.organization.blocks.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <OrganizationCreateForm
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
