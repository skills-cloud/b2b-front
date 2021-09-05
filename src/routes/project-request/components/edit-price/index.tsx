import React from 'react';
import { useTranslation } from 'react-i18next';

import Input from 'component/form/input';
import { useClassnames } from 'hook/use-classnames';

import style from './index.module.pcss';

const EditPrice = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    return (
        <div className={cn('field')}>
            <Input name="max_price" type="text" label={t('routes.project-request.blocks.price.field')} />
        </div>
    );
};

export default EditPrice;
