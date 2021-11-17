import React, { ReactNode, useMemo } from 'react';

import { useClassnames } from 'hook/use-classnames';

import Tooltip from 'component/tooltip';

import style from './index.module.pcss';

interface IProps {
    tooltip?: string,
    children: ReactNode,
    theme?: 'dark' | 'light'
}

const defaultProps = {
    theme: 'dark'
};

const SkillsTag = (props: IProps & typeof defaultProps) => {
    const cn = useClassnames(style);

    const elContent = useMemo(() => {
        return <span className={cn('skills-tag__content')}>{props.children}</span>;
    }, [props.children]);

    if(props.tooltip) {
        return (
            <Tooltip
                className={cn('skills-tag')}
                content={props.tooltip}
                theme={props.theme}
            >
                {elContent}
            </Tooltip>
        );
    }

    return (
        <div className={cn('skills-tag')}>
            {elContent}
        </div>
    );
};

SkillsTag.defaultProps = defaultProps;

export default SkillsTag;
