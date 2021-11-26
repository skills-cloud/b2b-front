import React from 'react';
import { useTranslation } from 'react-i18next';

import Textarea from 'component/form/textarea';

const EditOuther = () => {
    const { t } = useTranslation();

    return (
        <Textarea name="description" label={t('routes.project-request.blocks.other.description')} />
    );
};

export default EditOuther;
