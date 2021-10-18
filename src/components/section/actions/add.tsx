import React from 'react';

import IconPlus from 'component/icons/plus';
import Action, { IAction } from './index';

const AddAction = (props: Omit<IAction<HTMLButtonElement | HTMLAnchorElement>, 'children'>) => (
    <Action {...props} type="button">
        <IconPlus />
    </Action>
);

export default AddAction;
