import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import CheckboxTree from 'component/checkbox-tree';
import Button from 'component/button';

import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

const EDIT_ROLE_FORM_ID = 'EDIT_ROLE_FORM_ID';

interface IEditRole {
    onBack: () => void,
    onClose: () => void,
    requirements: RequestRequirementRead
}

const EditRole = ({ onBack, onClose, requirements }: IEditRole) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const form = useForm();
    const [post] = mainRequest.usePostRequestRequirementCompetenciesSetMutation();
    const [checked, setChecked] = useState<Array<string>>(
        requirements.competencies?.map(({ competence }) => String(competence?.id)) || []
    );

    useEffect(() => {
        setChecked(requirements.competencies?.map(({ competence }) => String(competence?.id)) || []);
    }, [JSON.stringify(requirements.competencies)]);

    const handleSubmit = useCallback(() => {
        const requirementsId = requirements.id;

        if(!requirementsId) {
            return;
        }

        const competencies = checked.map((id) => ({
            competence_id: parseInt(id, 10)
        }));

        post({ id: requirementsId, competencies })
            .unwrap()
            .then(onClose)
            .catch(console.error);
    }, [checked]);

    const onSetRequirementExperience = (id: string) => {
        console.info('SET REQ FOR ID: ', id);
    };

    return (
        <Modal
            onBack={onBack}
            header={requirements?.position?.name}
            footer={
                <ModalFooterSubmit>
                    <Button isSecondary={true} onClick={onBack}>
                        {t('routes.project-request.requirements.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={EDIT_ROLE_FORM_ID}>
                        {t('routes.project-request.requirements.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <div className="position">
                <FormProvider {...form}>
                    <form
                        method="POST"
                        id={EDIT_ROLE_FORM_ID}
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className={cn('form')}
                    >
                        <CheckboxTree
                            onSetChecked={setChecked}
                            competencies={checked}
                            onClickExperience={onSetRequirementExperience}
                        />
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
};

export default EditRole;
