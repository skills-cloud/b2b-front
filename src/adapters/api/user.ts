import { request } from 'adapter/request';

export interface IResponseUser {
    image: string,
    login: string,
    name: string
}

export const user = () => {
    return request<IResponseUser>({
        url: '/ui/user'
    });
};

export default {
    user
};
