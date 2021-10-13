import React from 'react';

import IconDelete from 'component/icons/delete';
import Action, { IAction } from './index';

const DeleteAction = (props: Omit<IAction<HTMLButtonElement | HTMLAnchorElement>, 'children'>) => (
    <Action {...props} type="button">
        <IconDelete />
    </Action>
);

export default DeleteAction;
