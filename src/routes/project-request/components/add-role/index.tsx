import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { useClassnames } from 'hook/use-classnames';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Select from 'component/form/select';
import InputDictionary from 'component/form/input-dictionary';
import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';
import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';

import style from './index.module.pcss';

const ADD_ROLE_FORM_ID = 'ADD_ROLE_FORM_ID';
// eslint-disable-next-line @typescript-eslint/naming-convention
const PEOPLE_SELECT = Array.from({ length: 10 }, (_, i) => i + 1);

interface IAddRole {
    onBack: () => void,
    requestId: number,
    nextStep: (id: number) => void
}

interface IForm {
    position_id: {
        label: string,
        value: string
    },
    people: {
        label: string,
        value: string
    }
}

const AddRole = ({ onBack, requestId, nextStep }: IAddRole) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const [post] = mainRequest.usePostMainRequestRequirementMutation({});

    const form = useForm({
        defaultValues: {
            people: {
                value: PEOPLE_SELECT[0],
                label: t('routes.project-request.requirements.edit-modal.people-in-roles', { people: PEOPLE_SELECT[0] })
            }
        }
    });

    const onSubmit = (values: IForm) => {
        const body: RequestRequirement = {
            request_id : requestId,
            position_id: parseInt(values.position_id.value, 10),
            count      : parseInt(values.people.value, 10)
        };

        post(body)
            .unwrap()
            .then((data) => {
                nextStep(data.id);
            })
            .catch(console.error);
    };

    return (
        <Modal
            onBack={onBack}
            header={t('routes.project-request.requirements.edit-modal.new-role')}
            footer={
                <ModalFooterSubmit>
                    <Button isSecondary={true} onClick={onBack}>
                        {t('routes.project-request.requirements.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={ADD_ROLE_FORM_ID}>
                        {t('routes.project-request.requirements.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >

            <FormProvider {...form}>
                <form method="POST" id={ADD_ROLE_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className={cn('form')}>
                    <InputDictionary
                        requestType={InputDictionary.requestType.Position}
                        isMulti={false}
                        name="position_id"
                        placeholder={t('routes.project-request.requirements.edit-modal.position')}
                    />
                    <Select
                        name="people"
                        options={PEOPLE_SELECT.map((people) => ({
                            label: t('routes.project-request.requirements.edit-modal.people-in-roles', { people }),
                            value: people.toString()
                        }))}
                    />
                </form>
            </FormProvider>
        </Modal>
    );
};

export default AddRole;
