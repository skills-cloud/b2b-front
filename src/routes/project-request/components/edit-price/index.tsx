import React from 'react';
import { useTranslation } from 'react-i18next';

import Input from 'component/form/input';

const EditPrice = () => {
    const { t } = useTranslation();

    return (
        <Input name="max_price" type="text" label={t('routes.project-request.blocks.price.field')} />
    );
};

export default EditPrice;