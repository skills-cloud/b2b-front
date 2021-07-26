import { createAction } from '@reduxjs/toolkit';

import { IUserData } from 'adapter/api/acc';

export const set = createAction<Partial<IUserData>>(
    '@@user/SET'
);

export const reset = createAction(
    '@@user/RESET'
);
