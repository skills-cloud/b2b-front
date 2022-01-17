import React, { useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import useClassnames from 'hook/use-classnames';
import { ORGANIZATION_ID, ORGANIZATION_PROJECT_ID, ORGANIZATION_PROJECT_MODULE_REQUEST_ID } from 'helper/url-list';

import Table from 'component/table';
import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import Loader from 'component/loader';
import Empty from 'component/empty';

import { mainRequest } from 'adapter/api/main';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';

import style from './index.module.pcss';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';

const NON_TABLE_HEIGHT = 40;

interface ICounter {
    total: number,
    work: number,
    done: number
}

type TRole = 'admin' | 'pfm' | 'pm' | 'rm';

const Dashboard = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const { data, isLoading } = mainRequest.useGetMainOrganizationContractorQuery(undefined);

    const idList = useMemo(() => {
        if(data?.results?.length) {
            const res: Array<{ id: number, role: TRole }> = [];

            data?.results.forEach((item) => {
                if(item.id) {
                    res.push({
                        id  : item.id,
                        role: item.current_user_role as TRole
                    });
                }
            });

            return res;
        }

        return undefined;
    }, [JSON.stringify(data?.results)]);

    const { data: projectsData, isLoading: projectsLoading } = mainRequest.useGetMainOrganizationProjectListQuery({
        organization_contractor_id: idList?.map((item) => item.id)
    }, {
        skip: !idList?.length
    });

    const { data: requestData, isLoading: requestLoading } = mainRequest.useGetMainRequestQuery({
        organization_project_id: projectsData?.results?.map((item) => item.id as number)
    }, {
        skip: !!idList?.length && idList.filter((item) => item.role === 'pm').length === 0 && projectsData?.results.length !== 0
    });

    const columnsProjects: ColumnsType<OrganizationProjectRead> = [
        {
            title : t('routes.dashboard.table.head.project'),
            key   : 'name',
            width : 160,
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            render: (item) => {
                return (
                    <Link
                        to={ORGANIZATION_PROJECT_ID(item.organization_customer_id, item.id)}
                        className={cn('dashboard__link')}
                    >
                        {item.name}
                    </Link>
                );
            }
        },
        {
            title    : t('routes.dashboard.table.head.customer'),
            key      : 'info',
            dataIndex: 'organization_customer',
            sorter   : (a, b) => (a.organization_customer?.name || '').localeCompare(b.organization_customer?.name || ''),
            render   : (organization_customer) => {
                return (
                    <Link
                        to={ORGANIZATION_ID(organization_customer.id)}
                        className={cn('dashboard__link')}
                    >
                        {organization_customer.name}
                    </Link>
                );
            }
        },
        {
            title    : t('routes.dashboard.table.head.time'),
            dataIndex: 'date_from',
            width    : 120,
            render   : (item) => {
                if(item?.date_from || item?.date_to) {
                    return `${item?.date_from} - ${item?.date_to}`.trim();
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table.head.rp'),
            dataIndex: 'manager',
            render   : (manager) => {
                if(manager) {
                    return `${manager.last_name} ${manager.first_name.substring(0, 1).toUpperCase()}.`;
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table.head.requests'),
            dataIndex: 'requests_count_by_status',
            render   : ({ draft, in_progress, done, closed }) => {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                return draft + in_progress + done + closed;
            }
        },
        {
            title    : t('routes.dashboard.table.head.done'),
            dataIndex: 'requests_count_by_status',
            render   : ({ done }) => {
                return done;
            }
        }
    ];

    const columnsRequests: ColumnsType<RequestRead> = [
        {
            title : t('routes.dashboard.table-request.head.project-request'),
            key   : 'title',
            width : 200,
            sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
            render: (item) => {
                const ids = {
                    organizationId: item.module.organization_project.organization_customer_id,
                    projectId     : item.module.organization_project_id,
                    moduleId      : item.module.id,
                    requestId     : item.id
                };

                if(item.status === 'closed') {
                    return (
                        <div className={cn('dashboard__disabled-text')}>
                            {item.title || t('routes.dashboard.table.values.empty')}
                        </div>
                    );
                }

                return (
                    <Link
                        to={ORGANIZATION_PROJECT_MODULE_REQUEST_ID(ids.organizationId, ids.projectId, ids.moduleId, ids.requestId)}
                        className={cn('dashboard__link')}
                    >
                        {item.title || t('routes.dashboard.table.values.empty')}
                    </Link>
                );
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.status'),
            key      : 'status',
            dataIndex: 'status',
            sorter   : (a, b) => (a.status || '').localeCompare(b.status || ''),
            render   : (status) => {
                return status;
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.start'),
            dataIndex: 'start_date',
            width    : 120,
            render   : (item) => {
                if(item?.start_date) {
                    return item.start_date;
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.pm'),
            dataIndex: 'resource_manager',
            render   : (resource_manager) => {
                if(resource_manager) {
                    return `${resource_manager.last_name} ${resource_manager.first_name.substring(0, 1).toUpperCase()}.`;
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.customer'),
            dataIndex: 'module',
            render   : (module) => {
                return module.organization_project.organization_customer.name || t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.rpp'),
            dataIndex: 'module',
            render   : (module) => {
                if(module.manager) {
                    return `${module.manager.last_name} ${module.manager.first_name.substring(0, 1).toUpperCase()}.`;
                }

                return t('routes.dashboard.table.values.empty');
            }
        }
    ];

    const elTable = () => {
        if(isLoading || projectsLoading || requestLoading) {
            return <Loader />;
        }

        if(requestData?.results?.length) {
            return (
                <Table<RequestRead>
                    columns={columnsRequests}
                    dataSource={requestData.results}
                    tableLayout="fixed"
                    className={cn('table')}
                    loading={isLoading || projectsLoading}
                    scroll={{ y: `calc(100vh - ${NON_TABLE_HEIGHT}px)` }}
                    rowKey="id"
                />
            );
        }

        if(projectsData?.results?.length) {
            return (
                <Table<OrganizationProjectRead>
                    columns={columnsProjects}
                    dataSource={projectsData.results}
                    tableLayout="fixed"
                    className={cn('table')}
                    loading={isLoading || projectsLoading}
                    scroll={{ y: `calc(100vh - ${NON_TABLE_HEIGHT}px)` }}
                    rowKey="id"
                />
            );
        }

        return <Empty>{t('routes.dashboard.empty')}</Empty>;
    };

    const elCounters = useMemo(() => {
        const counters = projectsData?.results.reduce((acc, curr) => {
            if(curr.requests_count_total && curr.requests_count_total >= 0) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                acc.total = acc.total + curr.requests_count_total;
            }

            if(curr.requests_count_by_status?.in_progress && curr.requests_count_by_status?.in_progress >= 0) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                acc.work = acc.work + curr.requests_count_by_status?.in_progress;
            }

            if(curr.requests_count_by_status?.done && curr.requests_count_by_status?.done >= 0) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                acc.done = acc.done + curr.requests_count_by_status?.done;
            }

            return acc;
        }, {
            total: 0,
            work : 0,
            done : 0
        } as ICounter);

        return (
            <div className={cn('dashboard__counters')}>
                <div className={cn('dashboard__counter')}>
                    <span className={cn('dashboard__counter-text')}>{t('routes.dashboard.counters.projects')}</span>
                    {isLoading ? <Loader /> : <span className={cn('dashboard__counter-value')}>{counters?.total}</span>}
                </div>
                <div className={cn('dashboard__counter')}>
                    <span className={cn('dashboard__counter-text')}>{t('routes.dashboard.counters.requests')}</span>
                    {isLoading ? <Loader /> : <span className={cn('dashboard__counter-value')}>{counters?.done}</span>}
                </div>
                <div className={cn('dashboard__counter')}>
                    <span className={cn('dashboard__counter-text')}>{t('routes.dashboard.counters.work')}</span>
                    {isLoading ? <Loader /> : <span className={cn('dashboard__counter-value')}>{counters?.work}</span>}
                </div>
            </div>
        );
    }, [isLoading, projectsLoading, projectsData?.results?.length]);

    return (
        <div className={cn('dashboard')}>
            <SidebarLayout>
                <Section>
                    <div className={cn('dashboard__wrapper')}>
                        <h1 className={cn('dashboard__title')}>
                            {t('routes.dashboard.title', {
                                val: requestData?.results?.length ? 'РП' : 'РПП'
                            })}
                        </h1>
                        {elCounters}
                        {elTable()}
                    </div>
                </Section>
            </SidebarLayout>
        </div>
    );
};

export default Dashboard;
