import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';

import { UserManageRead } from 'adapter/types/acc/user-manage/get/code-200';

import SystemUserForm from '../form';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields: UserManageRead
}

const EditModal = ({ setVisible, fields }: IEditModal) => {
    const { t } = useTranslation();

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.organization.blocks.edit-modal.header')}
        >
            <SystemUserForm defaultValues={fields} />
        </Modal>
    );
};

export default EditModal;
