import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { IStyle, useClassnames } from 'hook/use-classnames';

import IconFileImage from 'component/icons/file-image';
import IconFilePdf from 'component/icons/file-pdf';
import IconFileDocument from 'component/icons/file-document';
import IconDelete from 'component/icons/delete';

import { CvCareerFileRead } from 'adapter/types/cv/career/id/get/code-200';

import style from './index.module.pcss';

export interface IProps {
    name: string,
    className?: string | IStyle,
    children?: ReactNode,
    required?: boolean,
    multiple?: boolean,
    files?: Array<CvCareerFileRead>
}

export interface IFile {
    name: string,
    type: string
}

const InputFile = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const { control, watch, trigger } = useFormContext();

    const val = watch(props.name);

    const [formDataFiles, setFormDataFiles] = useState<Array<CvCareerFileRead>>([]);
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        if(val?.length) {
            void trigger(props.name);
            setFormDataFiles((oldState) => ([
                ...oldState,
                ...val
            ]));
        }
    }, [val]);

    const onChange = useCallback((filesArr: FileList | null) => {
        const formDataArr: Array<Partial<CvCareerFileRead>> = [];

        if(filesArr?.length) {
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for(let i = 0; i < filesArr.length; i++) {
                const formData = new FormData();

                formData.set('file', filesArr[i]);

                formDataArr.push({
                    file_name: filesArr[i].name,
                    file_ext : filesArr[i].type
                });
            }
        }

        setFormDataFiles((oldState) => ([
            ...oldState,
            ...formDataArr
        ]));
    }, []);

    const onClickDelete = (index: number) => () => {
        const files = [...formDataFiles];

        files.splice(index, 1);

        setFormDataFiles(files);
        setValue('');
    };

    const elFileIcon = useCallback((type?: string) => {
        switch (type) {
            case 'image/png':
            case 'image/jpg':
            case 'image/jpeg':
            case 'jpg':
            case 'png':
            case 'jpeg':
                return <IconFileImage />;

            case 'application/pdf':
                return <IconFilePdf />;

            default:
                return <IconFileDocument />;
        }
    }, []);

    const elList = useMemo(() => {
        if(formDataFiles?.length) {
            return (
                <ul className={cn('input-file__list')}>
                    {formDataFiles.map((item, index) => (
                        <li key={index} className={cn('input-file__list-item')}>
                            {elFileIcon(item.file_ext)}
                            <span>{item.file_name}</span>
                            <IconDelete svg={{ onClick: onClickDelete(index) }} />
                        </li>
                    ))}
                </ul>
            );
        }
    }, [formDataFiles]);

    const elContent = useMemo(() => {
        if(!props.children) {
            return (
                <div className={cn('input-file__link-append')}>
                    {t('components.form.input-file.add')}
                </div>
            );
        }

        return props.children;
    }, [props.children]);

    return (
        <div className={cn('input-file')}>
            <label className={cn('input-file__label')}>
                {elContent}
                <Controller
                    name={props.name}
                    control={control}
                    render={({ field: { onChange: onChangeField, value: fieldValue } }) => {
                        return (
                            <input
                                type="file"
                                className={cn('input-file__field')}
                                multiple={props.multiple}
                                value={value}
                                onChange={(e) => {
                                    const files = e.target.files ? Array.from(e.target.files) : [];

                                    setValue(e.target.value);
                                    onChangeField(...files);
                                    onChange(e.target.files);
                                }}
                            />
                        );
                    }}
                />
            </label>
            {elList}
        </div>
    );
};

export default InputFile;
