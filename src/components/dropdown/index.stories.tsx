import React from 'react';

import Typography from '../typography';

import Dropdown, { IProps } from './';

export default {
    title    : 'Shepherd/Component/Dropdown',
    component: Dropdown,
    args     : {
        items: [
            // eslint-disable-next-line no-alert
            { elem: <Typography key={1}>На мне обработчик клика</Typography>, onClick: () => alert('!') },
            { elem: <Typography key={2}>А я нативная ссылка</Typography>, href: 'http://test.site' }
        ],
        top : '10px',
        left: '10px'
    }
};

export const Base = (props: IProps) => <Dropdown {...props} />;
