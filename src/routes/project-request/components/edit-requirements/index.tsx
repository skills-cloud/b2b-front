import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClassnames } from 'hook/use-classnames';
import { useForm, FormProvider } from 'react-hook-form';

import { H4 } from 'component/header';
import Tabs, { Tab } from 'component/tabs';
import Input from 'component/form/input';
import DotsAction from 'component/section/actions/dots';
import DeadlineDates from 'component/form/deadline-dates';
import SkillsTag from 'component/skills-tag';

import EditLocation from 'route/project-request/components/edit-location';
import EditPrice from 'route/project-request/components/edit-price';
import EditOther from 'route/project-request/components/edit-other';
import Empty from 'component/empty';
import { IValue } from 'component/form/select';

import { mainRequest } from 'adapter/api/main';
import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { NoName10 } from 'adapter/types/main/request-requirement/post/code-201';

import style from './index.module.pcss';

export const MAIN_REQUIREMENTS_FORM_ID = 'MAIN_REQUIREMENTS_FORM_ID';

export enum ETabs {
    Competence='competence',
    Location='location',
    Price='price',
    Other='other',
    Timing='timing'
}

interface IEditRequirements {
    editRequirements: RequestRequirementRead | undefined,
    onClose: () => void,
    onEditRole: () => void,
    activeTab: ETabs,
    setActiveTab: (tab: ETabs) => void,
    requestId: number
}

interface ISelect {
    value?: number,
    label: string
}

interface IForm extends Omit<RequestRequirementRead, 'status' | 'type_of_employment' | 'work_location_city'> {
    type_of_employment?: ISelect,
    work_location_city?: IValue,
    location: string,
    city: IValue,
    status?: {
        value: NoName10,
        label: string
    },
    date_to?: string,
    date_from?: string
}

const EditRequirements = ({ editRequirements, onClose, onEditRole, activeTab, setActiveTab, requestId }: IEditRequirements) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    const [patch] = mainRequest.usePatchMainRequestRequirementMutation();
    const [post] = mainRequest.usePostMainRequestRequirementMutation();
    const form = useForm<IForm>();

    useEffect(() => {
        form.setValue('location', editRequirements?.work_location_address || '');
        form.setValue('type_of_employment', editRequirements?.type_of_employment ? {
            value: editRequirements?.type_of_employment?.id,
            label: editRequirements?.type_of_employment?.name
        } : undefined);
        form.setValue('city', editRequirements?.work_location_city ? {
            value: String(editRequirements?.work_location_city?.id),
            label: editRequirements?.work_location_city?.name
        } : {
            value: '',
            label: ''
        });
        form.setValue('max_price', editRequirements?.max_price);
        form.setValue('description', editRequirements?.description);
        form.setValue('name', editRequirements?.name);
        form.setValue('date_from', editRequirements?.date_from);
        form.setValue('date_to', editRequirements?.date_to);
        form.setValue('status', editRequirements?.status ? {
            value: editRequirements?.status as NoName10,
            label: t(`routes.project-request.blocks.request-status.${editRequirements?.status}`)
        } : undefined);
    }, [editRequirements]);

    const onSubmit = ({
        type_of_employment,
        location,
        city,
        status,
        ...data
    }: IForm) => {
        const cityId = city?.value;
        const valueTypeOfEmployment = type_of_employment?.value;
        const id = editRequirements?.id;

        const body = {
            ...data,
            status               : status?.value ?? undefined,
            request_id           : requestId,
            work_location_address: location,
            work_location_city_id: cityId ? parseInt(cityId, 10) : undefined,
            type_of_employment_id: valueTypeOfEmployment ? valueTypeOfEmployment : undefined
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

    const elCompetenceTab = () => {
        if(activeTab === ETabs.Competence) {
            if(editRequirements?.position?.name) {
                return (
                    <div className={cn('edit-requirements__position')}>
                        <H4>
                            {t('routes.project-request.requirements.edit-modal.people', {
                                people  : editRequirements.count,
                                position: editRequirements.position.name
                            })}
                        </H4>
                        <DotsAction onClick={onEditRole} />
                        <div className={cn('edit-requirements__skills')}>
                            {editRequirements.competencies?.map((comp) => (
                                <SkillsTag
                                    key={comp.competence_id}
                                    tooltip={t('routes.project-request.requirements.edit-modal.experience.invariant', {
                                        context: comp.experience_years
                                    })}
                                    children={comp.competence?.name}
                                />
                            ))}
                        </div>
                    </div>
                );
            }

            return <Empty>{t('routes.project-request.requirements.edit-modal.empty')}</Empty>;
        }
    };

    return (
        <FormProvider {...form}>
            <form
                id={MAIN_REQUIREMENTS_FORM_ID}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className={cn('edit-requirements__name-gap')}>
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

                <div className={cn('edit-requirements__tab-content')}>
                    {elCompetenceTab()}
                    {activeTab === ETabs.Location && (
                        <EditLocation />
                    )}
                    {activeTab === ETabs.Price && (
                        <EditPrice />
                    )}
                    {activeTab === ETabs.Other && (
                        <EditOther />
                    )}
                    {activeTab === ETabs.Timing && (
                        <DeadlineDates labels={{
                            dateFrom: t('routes.project-request.requirements.edit-modal.date-from'),
                            dateTo  : t('routes.project-request.requirements.edit-modal.date-to')
                        }}
                        />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};

export default EditRequirements;
