import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import debounce from 'lodash.debounce';

import { dictionary } from 'adapter/api/dictionary';
import { mainRequest } from 'adapter/api/main';

import Modal from 'component/modal';
import { useDispatch } from 'component/core/store';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Select from 'component/form/select';
import Button from 'component/button';
import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';

const ADD_ROLE_FORM_ID = 'ADD_ROLE_FORM_ID';
// eslint-disable-next-line @typescript-eslint/naming-convention
const PEOPLE_SELECT = Array.from({ length: 10 }, (_, i) => i + 1);

interface IRequirements {
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

const Requirements = ({ onBack, requestId, nextStep }: IRequirements) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const dispatch = useDispatch();
    const [post] = mainRequest.usePostMainRequestRequirementMutation({});

    const form = useForm({
        defaultValues: {
            people: {
                value: PEOPLE_SELECT[0],
                label: t('routes.project-request.requirements.edit-modal.people-in-roles', { people: PEOPLE_SELECT[0] })
            }
        }
    });

    const onLoadPositionOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getPositionList.initiate({
            search: search_string
        }))
            .then(({ data }) => {
                if(data?.results?.length) {
                    const res = data.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    callback(res);
                } else {
                    callback(null);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, 150);

    const onSubmit = (values: IForm) => {
        const body: RequestRequirement = {
            request_id : requestId,
            position_id: parseInt(values.position_id.value, 10),
            count      : parseInt(values.people.value, 10)
        };

        post(body)
            .unwrap()
            .then((request) => {
                const data = request?.data;

                if(data) {
                    nextStep(data.id);
                }
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

            <div className="position">
                <FormProvider {...form}>
                    <form method="POST" id={ADD_ROLE_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className={cn('form')}>
                        <Select
                            name="position_id"
                            placeholder={t('routes.project-request.requirements.edit-modal.position')}
                            loadOptions={onLoadPositionOptions}
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
            </div>
        </Modal>
    );
};

export default Requirements;