import React, { ButtonHTMLAttributes } from 'react';

import { useClassnames } from 'hook/use-classnames';
import IconPencil from 'component/icons/pencil';
import style from './index.module.pcss';

const EditAction = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    const cn = useClassnames(style);

    return (
        <button {...props} type="button" className={cn('action-edit')}>
            <IconPencil />
        </button>
    );
};

export default EditAction;
