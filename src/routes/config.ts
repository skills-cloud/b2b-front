import { ComponentType } from 'react';
import { RouteProps } from 'react-router';

import Layout from 'component/layout';

import Main from './main';
import Specialists from './specialists';
import Person from './person';

export interface IProps extends RouteProps {
    layout?: ComponentType,
    isPublic?: boolean
}

// Базовые роуты
export const baseRoutes: Array<IProps> = [{
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/',
    component: Main
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/specialists',
    component: Specialists
}, {
    isPublic : true,
    exact    : true,
    layout   : Layout,
    path     : '/user/:id',
    component: Person
}];
