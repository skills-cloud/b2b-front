import React, { ButtonHTMLAttributes } from 'react';

import IconDelete from 'component/icons/delete';
import Action from './index';

const DeleteAction = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Action {...props} type="button">
        <IconDelete />
    </Action>
);

export default DeleteAction;
