import React from 'react';

interface IShortName {
    firstName?: string,
    lastName?: string
}

const ShortName = ({ firstName, lastName }: IShortName) => {
    if(!(firstName && lastName)) {
        return null;
    }

    return <span>{`${lastName} ${firstName.slice(0, 1)}.`}</span>;
};

export default ShortName;