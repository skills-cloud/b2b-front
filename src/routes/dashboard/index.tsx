import React, { useMemo } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';

import useClassnames from 'hook/use-classnames';

import Table from 'component/table';
import SidebarLayout from 'component/layout/sidebar';

import style from './index.module.pcss';
import { mainRequest } from 'adapter/api/main';
import Section from 'component/section';
import Loader from 'component/loader';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';
import { Link } from 'react-router-dom';
import { ORGANIZATION_ID, ORGANIZATION_PROJECT_ID } from 'helper/url-list';

const NON_TABLE_HEIGHT = 40;

const Dashboard = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const { data, isLoading } = mainRequest.useGetMainOrganizationContractorQuery(undefined);

    const idList = useMemo(() => {
        if(data?.results?.length) {
            const ids: Array<number> = [];

            data?.results.forEach((item) => {
                if(item.id) {
                    ids.push(item.id);
                }
            });

            return ids;
        }

        return undefined;
    }, [JSON.stringify(data?.results)]);

    const { data: projectsData, isLoading: projectsLoading } = mainRequest.useGetMainOrganizationProjectListQuery({
        organization_contractor_id: idList
    }, {
        skip: !idList?.length
    });

    const columns: ColumnsType<OrganizationProjectRead> = [
        {
            title    : t('routes.dashboard.table.head.project'),
            key      : 'name',
            width    : 160,
            sorter   : (a, b) => (a.name || '').localeCompare(b.name || ''),
            className: cn('table__task-id'),
            render   : (item) => {
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
                    return manager.name;
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title : t('routes.dashboard.table.head.requests'),
            key   : 'info',
            render: () => {
                return 1;
            }
        },
        {
            title : t('routes.dashboard.table.head.done'),
            key   : 'info',
            render: () => {
                return 2;
            }
        }
    ];

    const elTable = (
        <Table<OrganizationProjectRead>
            columns={columns}
            dataSource={projectsData?.results}
            tableLayout="fixed"
            className={cn('table')}
            loading={isLoading || projectsLoading}
            scroll={{ y: `calc(100vh - ${NON_TABLE_HEIGHT}px)` }}
            rowKey="id"
        />
    );

    const elCounters = useMemo(() => {
        if(isLoading || projectsLoading) {
            return <Loader />;
        }

        return (
            <div className={cn('dashboard__counters')}>
                <div className={cn('dashboard__counter')}>
                    <span className={cn('dashboard__counter-text')}>{t('routes.dashboard.counters.projects')}</span>
                    <span className={cn('dashboard__counter-value')}>{projectsData?.results?.length}</span>
                </div>
                <div className={cn('dashboard__counter')}>
                    <span className={cn('dashboard__counter-text')}>{t('routes.dashboard.counters.requests')}</span>
                    <span className={cn('dashboard__counter-value')}>{projectsData?.results?.length}</span>
                </div>
                <div className={cn('dashboard__counter')}>
                    <span className={cn('dashboard__counter-text')}>{t('routes.dashboard.counters.work')}</span>
                    <span className={cn('dashboard__counter-value')}>{projectsData?.results?.length}</span>
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
                                val: 'РРП'
                            })}
                        </h1>
                        {elCounters}
                        {elTable}
                    </div>
                </Section>
            </SidebarLayout>
        </div>
    );
};

export default Dashboard;
