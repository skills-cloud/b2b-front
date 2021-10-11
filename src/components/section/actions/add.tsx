import React, { ButtonHTMLAttributes } from 'react';

import IconPlus from 'component/icons/plus';
import Action from './index';

const AddAction = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Action {...props} type="button">
        <IconPlus />
    </Action>
);

export default AddAction;
