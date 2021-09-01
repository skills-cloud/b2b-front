import React, { ButtonHTMLAttributes } from 'react';

import IconSearch from 'component/icons/search';
import Action from './index';

const SearchAction = (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <Action {...props} type="button">
        <IconSearch />
    </Action>
);

export default SearchAction;
