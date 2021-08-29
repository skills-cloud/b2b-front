import React, { ButtonHTMLAttributes } from 'react';

import IconPencil from 'component/icons/pencil';
import Action from './index';

const EditAction = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Action {...props} type="button">
        <IconPencil />
    </Action>
);

export default EditAction;
