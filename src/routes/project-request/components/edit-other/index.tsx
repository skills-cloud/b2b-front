import React from 'react';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import Textarea from 'component/form/textarea';
import InputSelect from 'component/form/select';

import style from './index.module.pcss';

const EditOther = () => {
    const { t } = useTranslation();
    const cn = useClassnames(style);

    const options = [{
        value: 'open',
        label: t('routes.project-request.blocks.request-status.open')
    }, {
        value: 'in_progress',
        label: t('routes.project-request.blocks.request-status.in_progress')
    }, {
        value: 'done',
        label: t('routes.project-request.blocks.request-status.done')
    }, {
        value: 'closed',
        label: t('routes.project-request.blocks.request-status.closed')
    }];

    return (
        <div className={cn('edit-other')}>
            <InputSelect
                name="status"
                direction="column"
                label={t('routes.project-request.blocks.request-status.title')}
                options={options}
            />
            <Textarea name="description" label={t('routes.project-request.blocks.other.description')} />
        </div>
    );
};

export default EditOther;
