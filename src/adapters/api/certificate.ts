import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CvCertificate as IResponsePostCertificate } from 'adapter/types/cv/certificate/post/code-201';
import { CvCertificate as IResponsePatchCertificate } from 'adapter/types/cv/certificate/id/patch/code-200';
import { CvCertificateRead } from 'adapter/types/cv/certificate/get/code-200';

export interface IQueryParamsGetCertificateList {
    ordering?: Array<string>,
    search?: string,
    page?: number,
    page_size?: number,
    cv_id: string
}

export type TDataPostCertificate = Omit<IResponsePostCertificate, 'id'>;

export interface IResponseGetCertificateList {
    count: number,
    next: string,
    previous: string,
    results: Array<CvCertificateRead>
}

export const certificate = createApi({
    reducerPath: 'api/certificate',
    tagTypes   : ['certificate'],
    baseQuery  : fetchBaseQuery({
        baseUrl: '/api/cv'
    }),
    endpoints: (build) => ({
        getCertificateList: build.query<IResponseGetCertificateList, IQueryParamsGetCertificateList>({
            providesTags: ['certificate'],
            query       : (params) => ({
                url   : 'certificate/',
                method: 'GET',
                params
            })
        }),
        postCertificate: build.mutation<IResponsePostCertificate, TDataPostCertificate>({
            invalidatesTags: ['certificate'],
            query          : (body) => ({
                url   : 'certificate/',
                method: 'POST',
                body
            })
        }),
        patchCertificateById: build.mutation<IResponsePatchCertificate, IResponsePatchCertificate>({
            invalidatesTags: ['certificate'],
            query          : (body) => {
                const { id, ...rest } = body;

                return {
                    url   : `certificate/${id}/`,
                    method: 'PATCH',
                    body  : rest
                };
            }
        }),
        deleteCertificateById: build.mutation<undefined, { id: number }>({
            invalidatesTags: ['certificate'],
            query          : (body) => ({
                url   : `certificate/${body.id}/`,
                method: 'DELETE'
            })
        })
    })
});
