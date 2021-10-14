import React from 'react';

import IconDots from 'component/icons/dots';
import Action, { IAction } from './index';

const DotsAction = (props: Omit<IAction<HTMLButtonElement | HTMLAnchorElement>, 'children'>) => (
    <Action {...props} disableBackground={true} type="button">
        <IconDots />
    </Action>
);

export default DotsAction;
