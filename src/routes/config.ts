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

export interface IProps extends RouteProps {
    layout?: ComponentType,
    isPublic?: boolean
}

// Базовые роуты
export const baseRoutes: Array<IProps> = [{
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
    path     : ['/specialists/:id', '/profile'],
    component: Person
}, {
    exact    : true,
    layout   : Layout,
    path     : '/project-request/create',
    component: ProjectCreate
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/project-request',
    component: ProjectRequestList
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/project-request/:id',
    component: ProjectRequest
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/404',
    component: NotFound
}];
