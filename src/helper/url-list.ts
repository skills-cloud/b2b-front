export interface IParams {
    requestId: string,
    projectId: string,
    specialistId: string,
    organizationId: string,
    requirementId: string,
    timesheetId: string,
    moduleId: string,
    subpage?: string
}

/* eslint-disable @typescript-eslint/naming-convention */
export const SPECIALISTS = '/specialists';
export const SPECIALIST_CREATE = '/specialists/create';
export const SPECIALIST_ID = (specialistId?: string | number) => `/specialists/${specialistId}`;

export const PROJECTS = '/projects';
export const PROJECTS_CREATE = '/projects/create';

export const ORGANIZATIONS = '/organizations';
export const ORGANIZATION_CREATE = '/organizations/create';
export const ORGANIZATION_ID = (organizationId?: string | number) => `/organizations/${organizationId}`;
export const ORGANIZATION_PROJECTS = (organizationId?: string | number) => `/organizations/${organizationId}/projects`;
export const ORGANIZATION_PROJECT_CREATE = (organizationId?: string | number) => `/organizations/${organizationId}/projects/create`;
export const ORGANIZATION_PROJECT_ID = (
    organizationId?: string | number,
    projectId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_ID = (
    organizationId?: string | number,
    projectId?: string | number,
    moduleId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`,
        `/modules/${moduleId}`
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_FUN_POINTS = (
    organizationId?: string | number,
    projectId?: string | number,
    moduleId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`,
        `/modules/${moduleId}`,
        '/fun-points'
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_CREATE = (
    organizationId?: string | number,
    projectId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`,
        '/modules/create'
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_REQUEST_CREATE = (
    organizationId?: string | number,
    projectId?: string | number,
    moduleId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`,
        `/modules/${moduleId}`,
        '/requests/create'
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_REQUEST_ID = (
    organizationId?: string | number,
    projectId?: string | number,
    moduleId?: string | number,
    requestId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`,
        `/modules/${moduleId}`,
        `/requests/${requestId}`
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_REQUEST_EDIT = (
    organizationId?: string | number,
    projectId?: string | number,
    moduleId?: string | number,
    requestId?: string | number
) => {
    const path = [
        `/organizations/${organizationId}`,
        `/projects/${projectId}`,
        `/modules/${moduleId}`,
        `/requests/${requestId}/edit`
    ];

    if(!organizationId) {
        path.shift();
    }

    return path.join('');
};
export const ORGANIZATION_PROJECT_MODULE_REQUEST_REQUIREMENT_SPECIALISTS = (
    pathname: string,
    requirementId?: string | number
) => `${pathname}/requirement/${requirementId}/specialists`;

export const REQUESTS = '/requests';
export const REQUEST_CREATE = '/requests/create';
export const REQUEST_ID = (requestId?: string | number) => `/requests/${requestId}`;
export const REQUEST_EDIT = (requestId?: string | number) => `/requests/${requestId}/edit`;

export const SYSTEM_USERS = '/system-users';
export const DASHBOARD = '/dashboard';
export const DICTIONARY = '/dictionary';


/* eslint-enable @typescript-eslint/naming-convention */
