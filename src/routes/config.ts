import { ComponentType } from 'react';
import { RouteProps } from 'react-router';

import Layout from 'component/layout';

import Main from './main';
import Specialists from './specialists';
import SpecialistsCreate from './specialists/create';
import Person from './person';
import Login from './login';
import ProjectCreate from './project-request/create';
import ProjectRequest from './project-request';
import NotFound from 'route/not-found';
import ProjectRequestList from 'route/project-request/list';
import Organization from 'route/organization';
import OrganizationProjects from 'route/organization-projects';
import Timesheets from 'route/timesheet';
import Organizations from 'route/organizations';
import OrganizationProjectCreate from 'route/organization-projects/create';
import OrganizationCreate from 'route/organizations/create';

export interface IProps extends RouteProps {
    layout?: ComponentType,
    isPublic?: boolean
}

// Базовые роуты
export const baseRoutes: Array<IProps> = [{
    exact    : true,
    layout   : Layout,
    path     : '/organizations',
    component: Organizations
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/create',
    component: OrganizationCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/:subpage(projects|main-info|cards)?',
    component: Organization
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/organizations/:organizationId/projects/:projectId/requests/:requestId/timesheets',
        '/requests/:requestId/timesheets'
    ],
    component: Timesheets
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/create',
    component: OrganizationProjectCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/:projectId/:subpage(main-info|requests)?',
    component: OrganizationProjects
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/login',
    component: Login
}, {
    exact    : true,
    layout   : Layout,
    path     : '/',
    component: Main
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/specialists',
        '/requests/:requestId/requirement/:requirementId/specialists',
        '/organizations/:organizationId/projects/:projectId/requests/:requestId/requirement/:requirementId/specialists'
    ],
    component: Specialists
}, {
    exact    : true,
    layout   : Layout,
    path     : '/specialists/create',
    component: SpecialistsCreate
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/specialists/:specialistId',
        '/organizations/:organizationId/projects/:projectId/requests/specialists/:specialistId'
    ],
    component: Person
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/requests/create',
        '/organizations/:organizationId/projects/:projectId/requests/create'
    ],
    component: ProjectCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/requests',
    component: ProjectRequestList
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/requests/:requestId',
        '/requests/:requestId/:subpage(edit|candidates)',
        '/organizations/:organizationId/projects/:projectId/requests/:requestId/:subpage(edit|candidates|requirement)?'
    ],
    component: ProjectRequest
}, {
    exact    : true,
    layout   : Layout,
    path     : '/404',
    component: NotFound
}];
