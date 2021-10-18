import React from 'react';
import { useTranslation } from 'react-i18next';

import { useClassnames } from 'hook/use-classnames';

import Input from 'component/form/input';
import InputDictionary from 'component/form/input-dictionary';

import style from './index.module.pcss';


const EditLocation = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    return (
        <div className={cn('form')}>
            <Input name="location" type="text" label={t('routes.project-request.blocks.location.point')} />
            <InputDictionary
                isMulti={false}
                requestType={InputDictionary.requestType.City}
                name="city"
                direction="column"
                label={t('routes.project-request.blocks.location.address')}
            />
            <InputDictionary
                isMulti={false}
                requestType={InputDictionary.requestType.TypeOfEmployment}
                name="type_of_employment"
                direction="column"
                label={t('routes.project-request.blocks.location.type-of-employment')}
            />
        </div>
    );
};

export default EditLocation;
