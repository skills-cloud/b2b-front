import React from 'react';
import { useTranslation } from 'react-i18next';

import Input from 'component/form/input';

const EditOuther = () => {
    const { t } = useTranslation();

    return (
        <Input name="description" type="text" label={t('routes.project-request.blocks.other.description')} />
    );
};

export default EditOuther;
