import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import Button from 'component/button';
import Modal from 'component/modal';

import { education } from 'adapter/api/education';

import style from './index.module.pcss';

interface IRemoveModal {
    nextStepAfterDelete: () => void,
    educationId: number | null
}

const RemoveModal = ({ nextStepAfterDelete, educationId }: IRemoveModal) => {
    const [deleteEducation] = education.useDeleteEducationByIdMutation();
    const { t } = useTranslation();
    const cn = useClassnames(style);

    const onDeleteItem = () => {
        if(educationId === null) {
            return;
        }

        deleteEducation({ id: educationId })
            .unwrap()
            .then(nextStepAfterDelete)
            .catch((err) => {
                console.error(err);
            });
    };

    if(educationId === null) {
        return null;
    }

    return (
        <Modal
            header={t('routes.person.education.confirm.title')}
            footer={
                <div className={cn('remove-modal-controls')}>
                    <Button type="button" onClick={onDeleteItem}>
                        {t('routes.person.education.confirm.confirm')}
                    </Button>
                    <Button
                        type="button"
                        isSecondary={true}
                        className={cn('education-edit__modal-close')}
                        onClick={nextStepAfterDelete}
                    >
                        {t('routes.person.education.confirm.cancel')}
                    </Button>
                </div>
            }
        >
            {null}
        </Modal>
    );
};

export default RemoveModal;
