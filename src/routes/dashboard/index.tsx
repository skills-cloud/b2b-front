import React, { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { isPast } from 'date-fns';

import useClassnames from 'hook/use-classnames';
import {
    ORGANIZATION_ID,
    ORGANIZATION_PROJECT_ID,
    ORGANIZATION_PROJECT_MODULE_REQUEST_ID,
    REQUEST_ID
} from 'helper/url-list';
import { useLocalStorage } from 'hook/use-localstorage';

import Table from 'component/table';
import SidebarLayout from 'component/layout/sidebar';
import Section from 'component/section';
import Loader from 'component/loader';
import Empty from 'component/empty';
import InputSelect from 'component/form/select';

import { mainRequest } from 'adapter/api/main';
import { acc } from 'adapter/api/acc';
import { OrganizationProjectRead } from 'adapter/types/main/organization-project/get/code-200';
import { RequestRead } from 'adapter/types/main/request/id/get/code-200';
import {
    RequestRequirementCvRead,
    RequestRequirementRead
} from 'adapter/types/main/request-requirement/id/get/code-200';
import { NoName8 as IRole } from 'adapter/types/acc/user-manage/get/code-200';

import style from './index.module.pcss';

const NON_TABLE_HEIGHT = 40;

interface ICounter {
    first: number,
    second: number,
    third: number
}

interface IRoleAndCompany {
    role: IRole | 'default',
    userId: string,
    companyId: string
}

const Dashboard = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { getStorage, setStorage } = useLocalStorage('userRole');

    const context = useForm();

    const { data, isFetching, refetch } = acc.useGetAccWhoAmIQuery(undefined);

    const company = context.watch('company');

    const [currentRoleAndCompany, setCurrentRoleAndCompany] = useState<IRoleAndCompany>({
        role     : 'default',
        userId   : '',
        companyId: ''
    });

    useEffect(() => {
        if(data?.organizations_contractors_roles) {
            const role = data.organizations_contractors_roles[0];

            const currentSettings = getStorage();

            if(data.id && currentSettings[data.id]) {
                const currentCompanyAndRole = currentSettings[data.id];

                setCurrentRoleAndCompany({
                    role     : currentCompanyAndRole.payload.role,
                    userId   : currentCompanyAndRole.payload.userId,
                    companyId: currentCompanyAndRole.value
                });

                context.setValue('company', currentCompanyAndRole);
            } else {
                setCurrentRoleAndCompany({
                    role     : role?.role,
                    userId   : String(data.id),
                    companyId: String(role?.organization_contractor_id)
                });

                const companyData = {
                    value: `${role?.organization_contractor_id}-${role?.role}`,
                    label: t(`routes.dashboard.organization-roles.${role?.role}`, {
                        organization: role?.organization_contractor_name
                    }),
                    payload: {
                        role  : role?.role,
                        userId: data.id
                    }
                };

                context.setValue('company', companyData);

                setStorage({
                    [`${data?.id}`]: companyData
                });
            }
        }
    }, [JSON.stringify(data)]);

    useEffect(() => {
        if(company) {
            setCurrentRoleAndCompany({
                role     : company.payload.role,
                userId   : company.payload.userId,
                companyId: company.value
            });

            setStorage({
                [`${data?.id}`]: company
            });
        }
    }, [company]);

    useEffect(() => {
        refetch();
    }, [data?.id]);

    const { data: projectsData, isFetching: projectsFetching } = mainRequest.useGetMainOrganizationProjectListQuery({
        manager_pm_id : currentRoleAndCompany?.role === 'pm' ? [data?.id as number] : undefined,
        manager_pfm_id: currentRoleAndCompany?.role === 'pfm' ? [data?.id as number] : undefined
    }, {
        refetchOnMountOrArgChange: true,
        skip                     : !data?.id && !currentRoleAndCompany?.role
    });

    const { data: requestsData, isFetching: requestFetching } = mainRequest.useGetMainRequestQuery({
        organization_project_id: projectsData?.results?.map((item) => item.id as number)
    }, {
        refetchOnMountOrArgChange: true,
        skip                     : !projectsData?.results?.length
    });

    const { data: requirementData, isFetching: requirementFetching } = mainRequest.useGetMainRequestRequirementQuery({
        manager_rm_id: currentRoleAndCompany?.role === 'rm' ? [data?.id as number] : undefined
    }, {
        refetchOnMountOrArgChange: true,
        skip                     : !data?.id || currentRoleAndCompany?.role !== 'rm'
    });

    const columnsProjects: ColumnsType<OrganizationProjectRead> = [
        {
            title           : t('routes.dashboard.table.head.project'),
            defaultSortOrder: 'descend',
            dataIndex       : ['part', 'item'],
            sorter          : (a, b) => {
                const inactiveA = a.date_to ? isPast(new Date(a.date_to)) : false;
                const inactiveB = b.date_to ? isPast(new Date(b.date_to)) : false;

                if(a.id && b.id) {
                    if(inactiveA && !inactiveB) {
                        return -1;
                    } else if(inactiveB && inactiveA) {
                        return 0;
                    } else if(!inactiveA && !inactiveB) {
                        return 0;
                    } else if(!inactiveA && inactiveB) {
                        return 1;
                    }

                    return a.id - b.id;
                }

                return 0;
            },
            render: (empty, item) => {
                const inactive = item.date_to ? isPast(new Date(item.date_to)) : false;

                if(!inactive) {
                    return (
                        <Link
                            to={ORGANIZATION_PROJECT_ID(item.organization_customer_id, item.id)}
                            className={cn('dashboard__link')}
                        >
                            {item.name}
                        </Link>
                    );
                }

                return (
                    <div className={cn('dashboard__disabled-text')}>
                        {item.name}
                    </div>
                );
            }
        },
        {
            title           : t('routes.dashboard.table.head.customer'),
            key             : 'customer',
            defaultSortOrder: undefined,
            sorter          : (a, b) => (a.organization_customer?.name || '').localeCompare(b.organization_customer?.name || ''),
            render          : (item) => {
                const inactive = item.date_to ? isPast(new Date(item.date_to)) : false;

                if(!inactive) {
                    return (
                        <Link
                            to={ORGANIZATION_ID(item.organization_customer.id)}
                            className={cn('dashboard__link')}
                        >
                            {item.organization_customer.name}
                        </Link>
                    );
                }

                return (
                    <div className={cn('dashboard__disabled-text')}>
                        {item.name}
                    </div>
                );
            }
        },
        {
            title : t('routes.dashboard.table.head.time'),
            render: (item) => {
                if(item?.date_from || item?.date_to) {
                    return `${item?.date_from} - ${item?.date_to}`.trim();
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table.head.rp'),
            dataIndex: 'manager_pm',
            render   : (manager_pm) => {
                if(manager_pm) {
                    return `${manager_pm.last_name} ${manager_pm.first_name.substring(0, 1).toUpperCase()}.`;
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
            render   : ({ done, closed }: { done: number, closed: number }) => {
                let count = 0;

                if(done) {
                    count = count + done;
                }

                if(closed) {
                    count = count + closed;
                }

                return count;
            }
        },
        {
            title    : t('routes.dashboard.table.head.in_progress'),
            dataIndex: 'requests_count_by_status',
            render   : ({ in_progress }) => {
                return in_progress;
            }
        }
    ];

    const columnsRequests: ColumnsType<RequestRead> = [
        {
            title : t('routes.dashboard.table-request.head.project-request'),
            key   : 'title',
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
            title           : t('routes.dashboard.table-request.head.status'),
            key             : 'status',
            dataIndex       : 'status',
            defaultSortOrder: 'descend',
            sorter          : (a, b) => {
                if(a.status && b.status) {
                    const statusHash = {
                        'in_progress': 3,
                        'draft'      : 2,
                        'done'       : 1,
                        'closed'     : 0
                    };

                    return statusHash[a.status] - statusHash[b.status];
                }

                return 0;
            },
            render: (status) => {
                return status;
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.start'),
            dataIndex: 'start_date',
            render   : (start_date) => {
                if(start_date) {
                    return start_date;
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.rm'),
            dataIndex: 'manager_rm',
            render   : (manager_rm) => {
                if(manager_rm) {
                    return `${manager_rm.last_name} ${manager_rm.first_name.substring(0, 1).toUpperCase()}.`;
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
            title : t('routes.dashboard.table-request.head.project'),
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
                            {item.module.organization_project?.name || t('routes.dashboard.table.values.empty')}
                        </div>
                    );
                }

                return (
                    <Link
                        to={ORGANIZATION_PROJECT_ID(ids.organizationId, ids.projectId)}
                        className={cn('dashboard__link')}
                    >
                        {item.module.organization_project?.name || t('routes.dashboard.table.values.empty')}
                    </Link>
                );
            }
        },
        {
            title    : t('routes.dashboard.table-request.head.rpp'),
            dataIndex: 'module',
            render   : (module) => {
                if(module.organization_project?.manager_pfm) {
                    return `${module.organization_project?.manager_pfm.last_name} ${module.organization_project?.manager_pfm.first_name.substring(0, 1).toUpperCase()}.`;
                }

                return t('routes.dashboard.table.values.empty');
            }
        }
    ];

    const columnsRequirements: ColumnsType<RequestRequirementRead> = [
        {
            title : t('routes.dashboard.table-requirement.head.req'),
            key   : 'name',
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            render: (item) => {
                if(item.status === 'closed') {
                    return (
                        <div className={cn('dashboard__disabled-text')}>
                            {item.title || t('routes.dashboard.table.values.empty')}
                        </div>
                    );
                }

                return (
                    <Link
                        to={REQUEST_ID(item.request_id)}
                        className={cn('dashboard__link')}
                    >
                        {item.name || t('routes.dashboard.table.values.empty')}
                    </Link>
                );
            }
        },
        {
            title : t('routes.dashboard.table-requirement.head.time'),
            render: (item) => {
                if(item?.date_from || item.date_to) {
                    return `${item.date_from} - ${item.date_to}`;
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title    : t('routes.dashboard.table-requirement.head.status'),
            key      : 'status',
            dataIndex: 'status',
            sorter   : (a, b) => (a.status || '').localeCompare(b.status || ''),
            render   : (status) => {
                return status;
            }
        },
        {
            title : t('routes.dashboard.table-requirement.head.total'),
            render: (item) => {
                return item.count || t('routes.dashboard.table.values.empty');
            }
        },
        {
            title : t('routes.dashboard.table-requirement.head.offer'),
            render: (item) => {
                const count = item.cv_list.filter((cvItem: RequestRequirementCvRead) => {
                    return cvItem.status === 'pre-candidate' || cvItem.status === 'candidate';
                }).length;

                return count || t('routes.dashboard.table.values.empty');
            }
        },
        {
            title : t('routes.dashboard.table-requirement.head.pm'),
            render: (item) => {
                if(item) {
                    const request = requestsData?.results?.find((reqItem) => {
                        return reqItem.id === item.request_id;
                    });
                    const manager = request?.module?.organization_project?.manager_pm;

                    if(manager) {
                        return `${manager.last_name} ${manager.first_name?.substring(0, 1).toUpperCase()}.`;
                    }
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title : t('routes.dashboard.table-requirement.head.request'),
            render: (item) => {
                if(item.status === 'closed') {
                    return (
                        <div className={cn('dashboard__disabled-text')}>
                            {item.title || t('routes.dashboard.table.values.empty')}
                        </div>
                    );
                }

                const request = requestsData?.results?.find((reqItem) => {
                    return reqItem.id === item.request_id;
                });

                return (
                    <Link
                        to={REQUEST_ID(item.request_id)}
                        className={cn('dashboard__link')}
                    >
                        {request?.title || t('routes.dashboard.table.values.empty')}
                    </Link>
                );
            }
        }
    ];

    const elTable = () => {
        if(isFetching || projectsFetching || requestFetching) {
            return <Loader />;
        }

        if(currentRoleAndCompany?.role === 'pm') {
            const dataToRender = requestsData?.results.filter((request) => {
                return parseInt(currentRoleAndCompany.companyId, 10) === request.module?.organization_project?.organization_contractor_id;
            });

            if(dataToRender?.length) {
                return (
                    <Table<RequestRead>
                        key={1}
                        columns={columnsRequests}
                        dataSource={dataToRender}
                        tableLayout="fixed"
                        className={cn('table')}
                        loading={isFetching || requestFetching}
                        scroll={{ y: `calc(100vh - ${NON_TABLE_HEIGHT}px)` }}
                        rowKey="id"
                    />
                );
            }
        }

        if((currentRoleAndCompany?.role === 'pfm')) {
            const dataToRender = projectsData?.results?.filter((item) => {
                return item.organization_contractor_id === parseInt(currentRoleAndCompany.companyId, 10);
            });

            if(dataToRender?.length) {
                return (
                    <Table<OrganizationProjectRead>
                        key={2}
                        columns={columnsProjects}
                        dataSource={dataToRender}
                        tableLayout="fixed"
                        className={cn('table')}
                        loading={isFetching || projectsFetching}
                        scroll={{ y: `calc(100vh - ${NON_TABLE_HEIGHT}px)` }}
                        rowKey="id"
                    />
                );
            }
        }

        if(requirementData?.results?.length && currentRoleAndCompany?.role === 'rm') {
            return (
                <Table<RequestRequirementRead>
                    key={3}
                    columns={columnsRequirements}
                    dataSource={requirementData.results}
                    tableLayout="fixed"
                    className={cn('table')}
                    loading={isFetching || projectsFetching}
                    scroll={{ y: `calc(100vh - ${NON_TABLE_HEIGHT}px)` }}
                    rowKey="id"
                />
            );
        }

        if(currentRoleAndCompany?.role === 'admin') {
            return <Empty>{t('routes.dashboard.empty-admin')}</Empty>;
        }

        return <Empty>{t('routes.dashboard.empty')}</Empty>;
    };

    const elHeader = () => {
        let headerContext = 'default';

        if(!isFetching && !projectsFetching && !requestFetching && !requirementFetching && currentRoleAndCompany?.role) {
            headerContext = currentRoleAndCompany.role;
        }

        return (
            <h1 className={cn('dashboard__title')}>
                {t('routes.dashboard.title', { context: headerContext })}
            </h1>
        );
    };

    const elSwitcher = () => {
        const roles = data?.organizations_contractors_roles;

        if(data?.id && roles?.length && roles?.length >= 2) {
            return (
                <FormProvider {...context}>
                    <form>
                        <InputSelect
                            name="company"
                            label={t('routes.dashboard.organization-roles.label')}
                            direction="column"
                            isMulti={false}
                            options={roles.map((role) => ({
                                value: `${String(role.organization_contractor_id)}-${role.role}`,
                                label: t(`routes.dashboard.organization-roles.${role.role}`, {
                                    organization: role.organization_contractor_name
                                }),
                                payload: {
                                    role  : role.role,
                                    userId: data.id
                                }
                            }))}
                        />
                    </form>
                </FormProvider>
            );
        }
    };

    const elCounters = useMemo(() => {
        const counters = projectsData?.results
            .filter((result) => currentRoleAndCompany && result.organization_contractor_id === parseInt(currentRoleAndCompany.companyId, 10))
            .reduce((accumulator, curr, index, array) => {
                if(!accumulator.first) {
                    accumulator.first = array.length;
                }

                if(curr.requests_count_by_status?.done && curr.requests_count_by_status?.done >= 0) {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    accumulator.second = accumulator.second + curr.requests_count_by_status?.done;
                }

                if(curr.requests_count_by_status?.closed && curr.requests_count_by_status?.closed >= 0) {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    accumulator.second = accumulator.second + curr.requests_count_by_status?.closed;
                }

                if(curr.requests_count_by_status?.in_progress && curr.requests_count_by_status?.in_progress >= 0) {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    accumulator.third = accumulator.third + curr.requests_count_by_status?.in_progress;
                }

                return accumulator;
            }, {
                first : 0,
                second: 0,
                third : 0
            } as ICounter);

        const peopleCount = requirementData?.results?.reduce((accumulator, curr) => {
            if(curr.cv_list?.length) {
                accumulator.offer = curr.cv_list.filter((person) => {
                    return person.status === 'pre-candidate' || person.status === 'candidate';
                }).length;
            }

            if(curr.count) {
                accumulator.need = accumulator.need + curr.count;
            }

            return accumulator;
        }, {
            need : 0,
            offer: 0
        });

        const countersReqs = requirementData?.results.reduce((accumulator, curr) => {
            if(curr.status === 'in_progress') {
                accumulator.first = accumulator.first + 1;
            }

            return accumulator;
        }, {
            first : 0,
            second: peopleCount?.need,
            third : peopleCount?.offer
        } as ICounter);

        const countersToRender = currentRoleAndCompany?.role === 'rm' ? countersReqs : counters;

        if(currentRoleAndCompany?.role && currentRoleAndCompany?.role !== 'admin' && countersToRender && Object.values(countersToRender).some((item) => item > 0)) {
            const isSomethingFetching = isFetching || projectsFetching || requestFetching || requirementFetching;

            return (
                <div className={cn('dashboard__counters')}>
                    <div className={cn('dashboard__counter')}>
                        <span className={cn('dashboard__counter-text')}>
                            {t('routes.dashboard.counters.first', { context: currentRoleAndCompany?.role })}
                        </span>
                        {isSomethingFetching ? <Loader /> : <span className={cn('dashboard__counter-value')}>{countersToRender?.first}</span>}
                    </div>
                    <div className={cn('dashboard__counter')}>
                        <span className={cn('dashboard__counter-text')}>
                            {t('routes.dashboard.counters.second', { context: currentRoleAndCompany?.role })}
                        </span>
                        {isSomethingFetching ? <Loader /> : <span className={cn('dashboard__counter-value')}>{countersToRender?.second}</span>}
                    </div>
                    <div className={cn('dashboard__counter')}>
                        <span className={cn('dashboard__counter-text')}>
                            {t('routes.dashboard.counters.third', { context: currentRoleAndCompany?.role })}
                        </span>
                        {isSomethingFetching ? <Loader /> : <span className={cn('dashboard__counter-value')}>{countersToRender?.third}</span>}
                    </div>
                </div>
            );
        }
    }, [
        isFetching,
        projectsFetching,
        requestFetching,
        requirementFetching,
        JSON.stringify(currentRoleAndCompany),
        JSON.stringify(projectsData?.results),
        JSON.stringify(requirementData?.results)
    ]);

    return (
        <div className={cn('dashboard')}>
            <SidebarLayout>
                <Section>
                    <div className={cn('dashboard__wrapper')}>
                        {elHeader()}
                        {elSwitcher()}
                        {elCounters}
                        {elTable()}
                    </div>
                </Section>
            </SidebarLayout>
        </div>
    );
};

export default Dashboard;
