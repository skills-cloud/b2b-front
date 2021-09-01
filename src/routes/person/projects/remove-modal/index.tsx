import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import Button from 'component/button';
import Modal from 'component/modal';

import { project } from 'adapter/api/project';

import style from './index.module.pcss';

interface IRemoveModal {
    nextStepAfterDelete: () => void,
    projectId: number | null
}

const RemoveModal = ({ nextStepAfterDelete, projectId }: IRemoveModal) => {
    const [deleteProject] = project.useDeleteProjectByIdMutation();
    const { t } = useTranslation();
    const cn = useClassnames(style);

    const onDeleteItem = () => {
        if(projectId === null) {
            return;
        }

        deleteProject({ id: projectId })
            .unwrap()
            .then(nextStepAfterDelete)
            .catch((err) => {
                console.error(err);
            });
    };

    if(projectId === null) {
        return null;
    }

    return (
        <Modal
            header={t('routes.person.projects.confirm.title')}
            footer={
                <div className={cn('remove-modal__controls')}>
                    <Button type="button" onClick={onDeleteItem}>
                        {t('routes.person.projects.confirm.confirm')}
                    </Button>
                    <Button
                        type="button"
                        isSecondary={true}
                        className={cn('remove-modal__modal-close')}
                        onClick={nextStepAfterDelete}
                    >
                        {t('routes.person.projects.confirm.cancel')}
                    </Button>
                </div>
            }
        >
            {null}
        </Modal>
    );
};

export default RemoveModal;
