import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClassnames } from 'hook/use-classnames';
import { useForm, FormProvider } from 'react-hook-form';

import { H3 } from 'component/header';

import Tabs, { Tab } from 'component/tabs';
import Input from 'component/form/input';
import IconDots from 'component/icons/dots';

import EditLocation from 'route/project-request/components/edit-location';
import EditPrice from 'route/project-request/components/edit-price';
import EditOuther from 'route/project-request/components/edit-outher';

import { mainRequest } from 'adapter/api/main';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';

import style from './index.module.pcss';

export const MAIN_REQUIREMENTS_FORM_ID = 'MAIN_REQUIREMENTS_FORM_ID';

export enum ETabs {
    Competence='competence',
    Location='location',
    Price='price',
    Other='other',
}

interface IEditRequirements {
    editRequirements: RequestRequirementRead | undefined,
    onClose: () => void,
    onEditRole: () => void,
    activeTab: ETabs,
    setActiveTab: (tab: ETabs) => void,
    requestId: number
}

interface IForm extends RequestRequirement{
    type_of_employment: {
        value: string,
        label: string
    },
    location: string,
    city: {
        value: string,
        label: string
    }
}

const EditRequirements = ({ editRequirements, onClose, onEditRole, activeTab, setActiveTab, requestId }: IEditRequirements) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    const [patch] = mainRequest.usePatchMainRequestRequirementMutation();
    const [post] = mainRequest.usePostMainRequestRequirementMutation();
    const form = useForm();

    useEffect(() => {
        form.setValue('location', editRequirements?.work_location_address);
        form.setValue('type_of_employment', editRequirements?.type_of_employment ? {
            value: editRequirements?.type_of_employment?.id,
            label: editRequirements?.type_of_employment?.name
        } : undefined);
        form.setValue('city', editRequirements?.work_location_city ? {
            value: editRequirements?.work_location_city?.id,
            label: editRequirements?.work_location_city?.name
        } : undefined);
        form.setValue('max_price', editRequirements?.max_price);
        form.setValue('description', editRequirements?.description);
        form.setValue('name', editRequirements?.name);
    }, [editRequirements]);

    const onSubmit = ({
        type_of_employment,
        location,
        city,
        max_price,
        description,
        name
    }: IForm) => {
        const cityId = city?.value;
        const valueTypeOfEmployment = type_of_employment?.value;
        const id = editRequirements?.id;

        const body = {
            request_id           : requestId,
            work_location_address: location,
            work_location_city_id: cityId ? parseInt(cityId, 10) : undefined,
            type_of_employment_id: valueTypeOfEmployment ? parseInt(valueTypeOfEmployment, 10) : undefined,
            max_price            : max_price,
            description          : description,
            name                 : name
        };


        if(id) {
            patch({
                ...body,
                id: id
            })
                .unwrap()
                .then(onClose)
                .catch(console.error);

            return;
        }

        post(body)
            .unwrap()
            .then(onClose)
            .catch(console.error);
    };

    return (
        <FormProvider {...form}>
            <form
                method="PATCH"
                id={MAIN_REQUIREMENTS_FORM_ID}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className={cn('name-gap')}>
                    <Input
                        name="name"
                        type="text"
                        label={t('routes.project-request.requirements.edit-modal.title-field')}
                    />
                </div>

                <Tabs>
                    {Object.values(ETabs).map((tab) => (
                        <Tab
                            active={tab === activeTab}
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                            }}
                        >
                            {t('routes.project-request.requirements.edit-modal.tab', { context: tab })}
                        </Tab>
                    ))}
                </Tabs>

                <div className={cn('tab-content')}>
                    {activeTab === ETabs.Competence && editRequirements?.position?.name && (
                        <div className={cn('position')}>
                            <H3>
                                {t(
                                    'routes.project-request.requirements.edit-modal.people',
                                    {
                                        people  : editRequirements.count,
                                        position: editRequirements.position.name
                                    })}
                            </H3>

                            <button
                                type="button"
                                className={cn('position-edit')}
                                onClick={onEditRole}
                            >
                                <IconDots
                                    svg={{
                                        width    : 24,
                                        height   : 24,
                                        className: cn('icon-dots')
                                    }}
                                />
                            </button>
                        </div>
                    )}

                    {activeTab === ETabs.Location && (
                        <EditLocation />
                    )}
                    {activeTab === ETabs.Price && (
                        <EditPrice />
                    )}
                    {activeTab === ETabs.Other && (
                        <EditOuther />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};

export default EditRequirements;