import React from 'react';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

import { dictionary } from 'adapter/api/dictionary';

import { useDispatch } from 'component/core/store';
import Select from 'component/form/select';
import Input from 'component/form/input';
import { useClassnames } from 'hook/use-classnames';
import style from './index.module.pcss';

const EditLocation = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const { data: typeOfEmployment } = dictionary.useGetTypeOfEmploymentQuery(undefined);
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

    return (
        <div className={cn('form')}>
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
        </div>
    );
};

export default EditLocation;