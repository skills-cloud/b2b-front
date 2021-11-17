import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import Button from 'component/button';
import ProjectRequestForm from '../form';

import { ModuleRead } from 'adapter/types/main/module/get/code-200';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    fields: ModuleRead
}

const FORM_MAIN_ID = 'FORM_MAIN_ID';

const EditModal = ({ setVisible, fields }: IEditModal) => {
    const { t } = useTranslation();

    return (
        <Modal
            onClose={() => setVisible(false)}
            header={t('routes.module.edit.header')}
            footer={
                <Fragment>
                    <Button
                        isSecondary={true} onClick={() => {
                            setVisible(false);
                        }}
                    >
                        {t('routes.module.edit.cancel')}
                    </Button>
                    <Button type="submit" form={FORM_MAIN_ID}>
                        {t('routes.module.edit.save')}
                    </Button>
                </Fragment>
            }
        >
            <ProjectRequestForm
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
