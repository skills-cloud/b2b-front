import React, { useEffect, useMemo, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';
import {
    ORGANIZATION_ID,
    ORGANIZATION_PROJECT_ID,
    ORGANIZATION_PROJECT_MODULE_REQUEST_ID,
    REQUEST_ID
} from 'helper/url-list';

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
    companyId: string
}

const Dashboard = () => {
    const cn = useClassnames(style);
    const { t } = useTranslation();

    const context = useForm();

    const { data, isFetching, refetch } = acc.useGetAccWhoAmIQuery(undefined);

    const company = context.watch('company');

    const [currentRoleAndCompany, setCurrentRoleAndCompany] = useState<IRoleAndCompany>({
        role     : 'default',
        companyId: ''
    });

    useEffect(() => {
        if(data?.organizations_contractors_roles) {
            const role = data.organizations_contractors_roles[0];

            setCurrentRoleAndCompany({
                role     : role?.role,
                companyId: String(role?.organization_contractor_id)
            });
            context.setValue('company', {
                value: role?.organization_contractor_id,
                label: t(`routes.dashboard.organization-roles.${role?.role}`, {
                    organization: role?.organization_contractor_name
                }),
                payload: role?.role
            });
        }
    }, [JSON.stringify(data)]);

    useEffect(() => {
        if(company) {
            setCurrentRoleAndCompany({
                role     : company.payload,
                companyId: company.value
            });
        }
    }, [company]);

    useEffect(() => {
        refetch();
    }, [data?.id]);

    const { data: projectsData, isFetching: projectsFetching } = mainRequest.useGetMainOrganizationProjectListQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const { data: requestsData, isFetching: requestFetching } = mainRequest.useGetMainRequestQuery({
        organization_project_id: projectsData?.results?.map((item) => item.id as number)
    }, {
        refetchOnMountOrArgChange: true
    });

    const { data: requirementData, isFetching: requirementFetching } = mainRequest.useGetMainRequestRequirementQuery(undefined, {
        refetchOnMountOrArgChange: true
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
            title : t('routes.dashboard.table.head.time'),
            width : 120,
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

                    if(request?.manager_rm) {
                        return `${request.manager_rm.last_name} ${request.manager_rm.first_name?.substring(0, 1).toUpperCase()}.`;
                    }
                }

                return t('routes.dashboard.table.values.empty');
            }
        },
        {
            title : t('routes.dashboard.table-requirement.head.request'),
            render: (item) => {
                const request = requestsData?.results?.find((reqItem) => {
                    return reqItem.id === item.request_id;
                });

                if(request?.title) {
                    return request.title;
                }

                return t('routes.dashboard.table.values.empty');
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

            return (
                <Table<RequestRead>
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

        if((currentRoleAndCompany?.role === 'pfm' || currentRoleAndCompany?.role === 'admin')) {
            const dataToRender = projectsData?.results?.filter((item) => {
                return item.organization_contractor_id === parseInt(currentRoleAndCompany.companyId, 10);
            });

            return (
                <Table<OrganizationProjectRead>
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

        if(requirementData?.results?.length && currentRoleAndCompany?.role === 'rm') {
            return (
                <Table<RequestRequirementRead>
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

        if(roles?.length && roles?.length >= 2) {
            return (
                <FormProvider {...context}>
                    <form>
                        <InputSelect
                            name="company"
                            label={t('routes.dashboard.organization-roles.label')}
                            direction="column"
                            isMulti={false}
                            options={roles.map((role) => ({
                                value: String(role.organization_contractor_id),
                                label: t(`routes.dashboard.organization-roles.${role.role}`, {
                                    organization: role.organization_contractor_name
                                }),
                                payload: role.role
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

        const countersReqs = projectsData?.results.reduce((accumulator, curr) => {
            if(curr.requests_requirements_count_total && curr.requests_requirements_count_total >= 0) {
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                accumulator.first = accumulator.first + curr.requests_requirements_count_total;
            }

            return accumulator;
        }, {
            first : 0,
            second: peopleCount?.need,
            third : peopleCount?.offer
        } as ICounter);

        const countersToRender = currentRoleAndCompany?.role === 'rm' ? countersReqs : counters;

        if(currentRoleAndCompany?.role && countersToRender && Object.values(countersToRender).some((item) => item > 0)) {
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
