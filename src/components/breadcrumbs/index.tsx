import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocationDescriptor } from 'history';
import { useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useClassnames, IStyle } from 'hook/use-classnames';

import { mainRequest } from 'adapter/api/main';
import { useDispatch } from 'component/core/store';
import { cv } from 'adapter/api/cv';

import style from './index.pcss';

export interface IBreadcrumb {
    label?: string,
    to?: LocationDescriptor,
    onClick?(): void
}

export interface IProps {
    children?: Array<IBreadcrumb>,
    className?: IStyle | string
}

export enum EItems {
    Requests = 'requests',
    Projects = 'projects',
    Specialists = 'specialists',
    Organizations = 'organizations'
}

interface IPath {
    text: string,
    link: string,
    skipTranslate?: boolean
}

const config = {
    [EItems.Projects]     : mainRequest.endpoints.getMainProjectById,
    [EItems.Requests]     : mainRequest.endpoints.getMainRequestById,
    [EItems.Specialists]  : cv.endpoints.getCvById,
    [EItems.Organizations]: mainRequest.endpoints.getMainOrganizationById
};

const Breadcrumbs = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const params = useParams<{ requestId: string, projectId: string, specialistId: string, organizationId: string }>();
    const location = useLocation();
    const [path, setPath] = useState<Array<IPath>>([]);

    useEffect(() => {
        const newPath = location.pathname.split('/').filter((value) => !!value).reduce((acc, curr, index, array) => {
            if(!parseInt(curr, 10) && parseInt(array[index + 1], 10)) {
                acc[curr] = {
                    id: array[index + 1]
                };
            }

            return acc;
        }, {});

        const requestList = [];

        if(params.organizationId) {
            requestList.push({
                dispatch: dispatch(config[EItems.Organizations].initiate({ id: params.organizationId })),
                id      : EItems.Organizations
            });
        }

        if(params.projectId) {
            requestList.push({
                dispatch: dispatch(config[EItems.Projects].initiate({ id: params.projectId })),
                id      : EItems.Projects
            });
        }

        if(params.requestId) {
            requestList.push({
                dispatch: dispatch(config[EItems.Requests].initiate({ id: params.requestId })),
                id      : EItems.Requests
            });
        }

        if(params.specialistId) {
            requestList.push({
                dispatch: dispatch(config[EItems.Specialists].initiate({ id: params.specialistId })),
                id      : EItems.Specialists
            });
        }

        Promise.all(requestList.map((item) => {
            return item.dispatch.then(({ data: loadData }) => {
                if(loadData) {
                    const name = 'name' in loadData ? loadData.name : '';
                    const lastName = 'last_name' in loadData ? loadData.last_name : '';
                    const typeName = 'type' in loadData ? loadData.type?.name : '';

                    return {
                        value      : item.id,
                        name       : name || lastName || typeName,
                        isTranslate: false
                    };
                }
            });
        }))
            .then((resp) => {
                resp.forEach((item) => {
                    if(item && newPath[item.value]) {
                        newPath[item.value] = {
                            ...newPath[item.value],
                            name: item.name
                        };
                    }
                });

                const locationArr = location.pathname.split('/').filter((value) => !!value).reduce((acc, curr, index) => {
                    const newItem = acc[index - 1] ? `${acc[index - 1]}/${curr}` : `/${curr}`;

                    acc.push(newItem);

                    return acc;
                }, [] as Array<string>);
                const flatPath = Object.keys(newPath)
                    .reduce((acc, curr) => {
                        if(!acc.find((item) => item.text === curr)) {
                            acc.push({
                                text: curr,
                                link: ''
                            }, {
                                text         : newPath[curr].name,
                                link         : '',
                                skipTranslate: true
                            });
                        }

                        return acc;
                    }, [] as Array<IPath>)
                    .map((item, index) => ({
                        ...item,
                        link: locationArr[index]
                    }));

                setPath(flatPath);
            })
            .catch(console.error);
    }, [location.pathname, dispatch, params.organizationId, params.projectId, params.specialistId, params.requestId]);

    return (
        <div className={cn('breadcrumbs')}>
            {path.map((item, index, array) => {
                const itemParams = {
                    className: cn('breadcrumbs__breadcrumb', {
                        'breadcrumbs__breadcrumb_link': index !== array.length - 1
                    }),
                    children: item.skipTranslate ? item.text : t(`components.breadcrumbs.${item.text.toLowerCase()}`)
                };

                if(index === array.length - 1) {
                    return <span key={index} {...itemParams} />;
                }

                return <Link key={index} to={item.link} {...itemParams} />;
            })}
        </div>
    );
};

export default Breadcrumbs;
