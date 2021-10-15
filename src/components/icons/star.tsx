import React from 'react';

import SVG, { IProps as IPropsSVG } from './index';

export interface IProps {
    svg?: IPropsSVG
}

export const IconStar = (props: IProps) => (
    <SVG {...props.svg} viewBox="0 0 24 24">
        <path d="M12,18.3l-6.2,3.2L7,14.6L2,9.8l6.9-1L12,2.5l3.1,6.3l6.9,1l-5,4.9l1.2,6.9L12,18.3z" />
    </SVG>
);

export default IconStar;

