import React, { MouseEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';

import { IStyle, useClassnames } from 'hook/use-classnames';

import { mainRequest } from 'adapter/api/main';

import DocumentCreator from './docx';
import style from './index.module.pcss';


export interface IProps {
    className?: IStyle | string
}

const ProjectRequestDocx = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const params = useParams<{ subpage?: string, id: string }>();
    const { data, refetch } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.id },
        { refetchOnMountOrArgChange: true }
    );

    const onPrint = useCallback((e: MouseEvent): void => {
        e.preventDefault();
        refetch();

        if(data) {
            const documentCreator = new DocumentCreator();

            const doc = documentCreator.create(data);

            void Packer.toBlob(doc).then((blob) => {
                saveAs(blob, 'request.docx');
            });
        }
    }, []);

    return (
        <div className={cn('docx')} onClick={onPrint}>
            {t('components.docx.download')}
        </div>
    );
};

export default ProjectRequestDocx;
