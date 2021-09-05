import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import debounce from 'lodash.debounce';

import { dictionary } from 'adapter/api/dictionary';
import { mainRequest } from 'adapter/api/main';

import { useDispatch } from 'component/core/store';
import Select from 'component/form/select';
import Input from 'component/form/input';
import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';
import { RequestRequirement } from 'adapter/types/main/request-requirement/post/code-201';

export const EDIT_LOCATION_FORM_ID = 'EDIT_LOCATION_FORM_ID';

interface IEditLocation {
    requirements: RequestRequirementRead,
    nextStep: () => void
}

interface IForm {
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

const EditLocation = ({ requirements, nextStep }: IEditLocation) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const [patch] = mainRequest.usePatchMainRequestRequirementMutation({});
    const { data: typeOfEmployment } = dictionary.useGetTypeOfEmploymentQuery(undefined);
    const form = useForm({
        defaultValues: {
            location          : requirements.work_location_address,
            type_of_employment: requirements.type_of_employment ? {
                value: requirements.type_of_employment?.id,
                label: requirements.type_of_employment?.name
            } : undefined,
            city: requirements.work_location_city ? {
                value: requirements.work_location_city?.id,
                label: requirements.work_location_city?.name
            } : undefined
        }
    });
    const dispatch = useDispatch();

    const onLoadCityOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getCityList.initiate({
            search: search_string
        }))
            .then(({ data: loadData }) => {
                if(loadData?.results?.length) {
                    const res = loadData.results.map((item) => ({
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

    const onSubmit = ({
        type_of_employment,
        location,
        city
    }: IForm) => {
        const cityId = city?.value;
        const valueTypeOfEmployment = type_of_employment?.value;
        const body: RequestRequirement = {
            id                   : requirements.id,
            request_id           : requirements.request_id,
            work_location_address: location,
            work_location_city_id: cityId ? parseInt(cityId, 10) : undefined,
            type_of_employment_id: valueTypeOfEmployment ? parseInt(valueTypeOfEmployment, 10) : undefined
        };

        patch(body)
            .unwrap()
            .then(nextStep)
            .catch(console.error);
    };

    return (
        <FormProvider {...form}>
            <form method="POST" id={EDIT_LOCATION_FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className={cn('form')}>
                <Input name="location" type="text" label={t('routes.project-request.blocks.location.point')} />
                <Select
                    name="city"
                    direction="column"
                    label={t('routes.project-request.blocks.location.address')}
                    loadOptions={onLoadCityOptions}
                />
                <Select
                    name="type_of_employment"
                    direction="column"
                    label={t('routes.project-request.blocks.location.type-of-employment')}
                    options={typeOfEmployment?.results.map((item) => ({ value: String(item.id), label: item.name })) || []}
                />
            </form>
        </FormProvider>
    );
};

export default EditLocation;