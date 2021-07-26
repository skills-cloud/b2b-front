import axios, { AxiosRequestConfig } from 'axios';

export const request = <T = void>(config?: AxiosRequestConfig): Promise<T> => {
    return axios({
        method : 'get',
        ...config,
        headers: {
            'cache-control': 'no-cache',
            ...config?.headers
        }
    })
        .then(
            (response) => {
                if(response.data) {
                    return response.data;
                }

                return response;
            },
            (error) => {
                throw error.response?.data || error;
            }
        );
};

export default { request };
