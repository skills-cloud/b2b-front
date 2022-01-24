import React from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';

import { UserManageRead } from 'adapter/types/acc/user-manage/get/code-200';

import SystemUserForm from '../form';

interface IEditModal {
    onSuccess?(): void,
    setVisible?: (visible: boolean) => void,
    fields: UserManageRead
}

const EditModal = ({ setVisible, onSuccess, fields }: IEditModal) => {
    const { t } = useTranslation();

    return (
        <Modal
            onClose={() => setVisible?.(false)}
            header={t('routes.system-edit.title')}
        >
            <SystemUserForm defaultValues={fields} onSuccess={onSuccess} />
        </Modal>
    );
};

export default EditModal;
