import React, { MouseEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Packer } from 'docx';
import { saveAs } from 'file-saver';

import { IParams } from 'helper/url-list';

import { mainRequest } from 'adapter/api/main';

import Base from '../index';
import DocumentCreator from './docx';

const ProjectRequestDocx = () => {
    const { t } = useTranslation();

    const params = useParams<IParams>();
    const { data, refetch } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.requestId },
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
        <Base onClick={onPrint}>
            {t('components.docx.download')}
        </Base>
    );
};

export default ProjectRequestDocx;
