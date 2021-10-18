import React from 'react';

import IconSearch from 'component/icons/search';
import Action, { IAction } from './index';

const SearchAction = (props: Omit<IAction<HTMLButtonElement | HTMLAnchorElement>, 'children'>) => (
    <Action {...props} type="button">
        <IconSearch />
    </Action>
);

export default SearchAction;
