import axios, { AxiosRequestConfig } from 'axios';
import qs from 'query-string';

// import validation from 'component/api/validation';

export const request = <T = void>(config?: AxiosRequestConfig): Promise<T> => {
    return axios({
        method          : 'get',
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'none' }),
        ...config,
        headers         : {
            'cache-control': 'no-cache',
            ...config?.headers
        }
    })
        .then(
            (response) => {
                // validation(response.config.url, response.config.method, response.status, response.data);

                if(response.data) {
                    if(response.data.data) {
                        return response.data.data;
                    }

                    return void(0);
                }

                return response;
            },
            (error) => {
                if(!axios.isCancel(error) && error.response) {
                    // validation(error.config.url, error.config.method, error.response.status, error.response.data);
                }

                throw error.response?.data || error;
            }
        );
};

export default { request };
