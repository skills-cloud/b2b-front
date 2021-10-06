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

export interface IProps extends RouteProps {
    layout?: ComponentType,
    isPublic?: boolean
}

// Базовые роуты
export const baseRoutes: Array<IProps> = [{
    exact    : true,
    layout   : Layout,
    path     : ['/organizations/:organizationId', '/organizations/:organizationId/projects'],
    component: Organization
}, {
    exact    : true,
    layout   : Layout,
    path     : '/organizations/:organizationId/projects/:projectId',
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
    exact    : true,
    layout   : Layout,
    path     : '/specialists',
    component: Specialists
}, {
    exact    : true,
    layout   : Layout,
    path     : '/specialists/create',
    component: SpecialistsCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : ['/specialists/:specialistId', '/profile'],
    component: Person
}, {
    exact    : true,
    layout   : Layout,
    path     : '/requests/create',
    component: ProjectCreate
}, {
    exact    : true,
    layout   : Layout,
    path     : '/requests',
    component: ProjectRequestList
}, {
    exact    : true,
    layout   : Layout,
    path     : ['/requests/:requestId', '/requests/:requestId/:subpage(edit|specialists)'],
    component: ProjectRequest
}, {
    exact    : true,
    layout   : Layout,
    path     : '/404',
    component: NotFound
}];
