import React from 'react';

import SVG, { IProps as IPropsSVG } from './index';

export interface IProps {
    svg?: IPropsSVG
}

export const IconStar = (props: IProps) => (
    <SVG {...props.svg} viewBox="0 0 12 12">
        <path d="M6 9.64421L9.708 12L8.724 7.56L12 4.57263L7.686 4.18105L6 0L4.314 4.18105L0 4.57263L3.27 7.56L2.292 12L6 9.64421Z" />
    </SVG>
);

export default IconStar;

