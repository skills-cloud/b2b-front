import { Styles } from 'react-select';

import { TProps } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: TProps, isFocus: boolean): Partial<Styles<any, false>> => {
    return {
        placeholder: () => ({
            fontFamily: 'Roboto',
            color     : '#a9a9a9',
            fontSize  : '14px',
            position  : 'absolute',
            top       : '50%',
            lineHeight: '40px',
            marginTop : '-20px',
            marginLeft: '4px'
        }),
        container: () => ({
            fontFamily  : 'Roboto',
            border      : 'solid 1px #d9d9d9',
            borderRadius: '4px',
            flexGrow    : 1,
            fontSize    : '14px',
            minHeight   : '40px',
            boxSizing   : '-moz-initial',
            position    : 'relative',
            borderColor : isFocus ? '#999' : '#d9d9d9',
            boxShadow   : isFocus ? '0 0 0 1px #999' : 'none',
            display     : 'flex'
        }),
        control: () => ({
            alignItems     : 'center',
            backgroundColor: props.disabled ? 'rgba(224, 224, 224, 0.25)' : '#fff',
            display        : 'flex',
            flexWrap       : 'wrap',
            justifyContent : 'center',
            outline        : 'none',
            position       : 'relative',
            transition     : 'all 100ms',
            minHeight      : '38px',
            height         : '100%',
            borderRadius   : '4px',
            flexGrow       : 1
        }),
        menu: () => ({
            top            : '100%',
            backgroundColor: 'hsl(0,0%,100%)',
            borderRadius   : '4px',
            boxShadow      : '0 0 0 1px hsla(0,0%,0%,0.1), 0 4px 11px hsla(0,0%,0%,0.1)',
            marginBottom   : '8px',
            marginTop      : '8px',
            position       : 'absolute',
            width          : '100%',
            zIndex         : 2,
            boxSizing      : 'border-box'
        }),
        multiValue: () => ({
            display        : 'block',
            height         : '24px',
            lineHeight     : '24px',
            backgroundColor: 'rgba(0, 112, 233, 0.15)',
            fontSize       : '12px',
            padding        : '0 24px 0 10px',
            color          : '#0070e9',
            whiteSpace     : 'nowrap',
            overflow       : 'hidden',
            textOverflow   : 'ellipsis',
            borderRadius   : '12px',
            textAlign      : 'center',
            fontWeight     : 500,
            position       : 'relative',
            margin         : '1px 3px'
        }),
        multiValueLabel : () => ({}),
        multiValueRemove: () => ({
            borderRadius   : '50%',
            backgroundColor: '#fff',
            fill           : '#0070e9',
            boxSizing      : 'border-box',
            position       : 'absolute',
            right          : '4px',
            top            : '4px',
            bottom         : '4px',
            cursor         : 'pointer',
            padding        : '4px'
        })
    };
};
