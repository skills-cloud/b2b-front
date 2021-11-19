import { ComponentType } from 'react';
import { RouteProps } from 'react-router';

import Layout from 'component/layout';

import Main from './main';
import Specialists from './specialists';
import SpecialistsCreate from './specialists/create';
import Person from './person';
import Login from './login';
import ProjectRequestCreate from './project-request/create';
import ProjectRequest from './project-request';
import NotFound from 'route/not-found';
import ProjectRequestList from 'route/project-request/list';
import Organization from 'route/organization';
import OrganizationProjects from 'route/organization-projects';
import Timesheets from 'route/timesheet';
import Organizations from 'route/organizations';
import OrganizationProjectCreate from 'route/organization-projects/create';
import OrganizationCreate from 'route/organizations/create';
import ModuleCreate from 'route/module/create';
import Module from 'route/module';
import FunctionalPoints from 'route/fun-points';

export interface IProps extends RouteProps {
    layout?: ComponentType,
    isPublic?: boolean
}

// Базовые роуты
export const baseRoutes: Array<IProps> = [{
    exact    : true,
    layout   : Layout,
    path     : '/',
    component: Main
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/login',
    component: Login
}, {
    exact    : true,
    layout   : Layout,
    path     : '/404',
    component: NotFound
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/specialists',
        '/requests/:requestId/requirement/:requirementId/specialists',
        '/organizations/:organizationId/projects/:projectId/modules/:moduleId/requests/:requestId/requirement/:requirementId/specialists'
    ],
    component: Specialists
}, {
    exact    : true,
    layout   : Layout,
    path     : '/specialists/create',
    component: SpecialistsCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/specialists/:specialistId',
    component: Person
}, {
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
    path     : '/organizations/:organizationId/:subpage(projects)?',
    component: Organization
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/create',
    component: OrganizationProjectCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/:projectId/:subpage(modules)?',
    component: OrganizationProjects
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/:projectId/modules/create',
    component: ModuleCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/:projectId/modules/:moduleId/:subpage(requests)?',
    component: Module
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/:projectId/modules/:moduleId/fun-points',
    component: FunctionalPoints
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/requests/create',
        '/organizations/:organizationId/projects/:projectId/modules/:moduleId/requests/create'
    ],
    component: ProjectRequestCreate
}, {
    exact : true,
    layout: Layout,
    path  : [
        '/organizations/:organizationId/projects/:projectId/modules/:moduleId/requests/:requestId/timesheets',
        '/requests/:requestId/timesheets'
    ],
    component: Timesheets
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
        '/organizations/:organizationId/projects/:projectId/modules/:moduleId/requests/:requestId/:subpage(candidates|requirement)?'
    ],
    component: ProjectRequest
}];
