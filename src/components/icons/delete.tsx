import React from 'react';

import SVG, { IProps as IPropsSVG } from './index';

export interface IProps {
    svg?: IPropsSVG
}

export const IconDelete = (props: IProps) => (
    <SVG {...props.svg}>
        <path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4ZM6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z" />
    </SVG>
);

export default IconDelete;

