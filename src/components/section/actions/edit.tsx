import React from 'react';

import IconPencil from 'component/icons/pencil';
import Action, { IAction } from './index';

const EditAction = (props: Omit<IAction<HTMLButtonElement | HTMLAnchorElement>, 'children'>) => {
    return (
        <Action {...props} type="button">
            <IconPencil />
        </Action>
    );
};

export default EditAction;
