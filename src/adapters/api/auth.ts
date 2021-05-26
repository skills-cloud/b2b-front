import { request } from 'adapter/request';

export const authGoogle = (idToken: string) => {
    return request({
        method: 'POST',
        url   : '/ui/auth/google',
        data  : idToken
    });
};

export default {
    authGoogle
};
