import { OptionTypeBase, Styles } from 'react-select';
import { IProps } from 'component/form/input-skills/types';
import { CSSProperties } from 'react';

export default (props: IProps, isFocus: boolean): Partial<Styles<OptionTypeBase, false>> => {
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
        container: (provided: CSSProperties) => ({
            ...provided,
            fontFamily  : 'Roboto',
            border      : 'solid 1px #d9d9d9',
            borderRadius: '4px',
            flexGrow    : 1,
            minHeight   : '40px',
            borderColor : isFocus ? '#999' : '#d9d9d9',
            boxShadow   : isFocus ? '0 0 0 1px #999' : 'none'
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
            borderRadius   : '4px'
        }),
        multiValue: () => ({
            display        : 'block',
            height         : '24px',
            lineHeight     : '24px',
            backgroundColor: 'rgba(170, 170, 170, 0.15)',
            fontSize       : '12px',
            padding        : '0 24px 0 10px',
            color          : '#121212',
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
            fill           : '#333',
            boxSizing      : 'border-box',
            position       : 'absolute',
            right          : '4px',
            top            : '4px',
            bottom         : '4px',
            cursor         : 'pointer',
            padding        : '3px'
        })
    };
};
