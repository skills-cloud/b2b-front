import React, { MouseEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';

import { IStyle, useClassnames } from 'hook/use-classnames';

import Button from 'component/button';

import { mainRequest } from 'adapter/api/main';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { callAddFont } from './font.ts';
import style from './index.module.pcss';

export interface IProps {
    className?: IStyle | string
}

jsPDF.API.events.push(['addFonts', callAddFont]);

const ProjectRequestPdf = (props: IProps) => {
    const cn = useClassnames(style, props.className, true);
    const { t } = useTranslation();

    const params = useParams<{ subpage?: string, id: string }>();
    const { data } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.id },
        { refetchOnMountOrArgChange: true }
    );

    const generatePdf = useCallback((): jsPDF | undefined => {
        if(data) {
            const doc = new jsPDF();

            doc.addFont('Roboto-Medium-normal.ttf', 'Roboto-Medium', 'normal');
            doc.setFont('Roboto-Medium', 'normal');

            doc.setFontSize(20);
            doc.text(data.project?.name || t('components.pdf.project.name'), 12, 15, { align: 'left' });

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.main-info'), 12, 30, { align: 'left' });

            doc.setFontSize(10);
            doc.text(t('components.pdf.project.sector'), 12, 40, { align: 'left' });
            doc.text(data.industry_sector?.name || t('components.pdf.project.empty'), 64, 40, { align: 'left' });

            doc.text(t('components.pdf.project.project'), 12, 46, { align: 'left' });
            doc.text(data.project?.name || t('components.pdf.project.empty'), 64, 46, { align: 'left' });

            const manager = `${data.resource_manager?.last_name || ''} ${(data.resource_manager?.first_name || '').slice(0, 1)}`;

            doc.text(t('components.pdf.project.manager'), 12, 52, { align: 'left' });
            doc.text(manager.trim() || t('components.pdf.project.empty'), 64, 52, { align: 'left' });

            const recruiter = `${data.recruiter?.last_name || ''} ${(data.recruiter?.first_name || '').slice(0, 1)}`;

            doc.text(t('components.pdf.project.recruiter'), 12, 58, { align: 'left' });
            doc.text(recruiter.trim() || t('components.pdf.project.empty'), 64, 58, { align: 'left' });

            doc.text(t('components.pdf.project.type'), 12, 64, { align: 'left' });
            doc.text(data.type?.name || t('components.pdf.project.empty'), 64, 64, { align: 'left' });

            doc.text(t('components.pdf.project.customer'), 12, 70, { align: 'left' });
            doc.text(data.customer?.name || t('components.pdf.project.empty'), 64, 70, { align: 'left' });

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.time'), 12, 86, { align: 'left' });

            doc.setFontSize(10);
            doc.text(t('components.pdf.project.time'), 12, 96, { align: 'left' });
            doc.text(t('components.pdf.project.empty'), 64, 96, { align: 'left' });

            doc.text(t('components.pdf.project.long'), 12, 102, { align: 'left' });
            doc.text(t('components.pdf.project.empty'), 64, 102, { align: 'left' });

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.reqs'), 12, 118, { align: 'left' });

            let startY = 128;

            data.requirements?.forEach((req, index) => {
                startY = startY + (index * 10);

                doc.setFontSize(14);
                doc.text(req.name || t('components.pdf.project.req-empty'), 12, startY, { align: 'left' });

                startY = startY + 10 + (index * 10);

                doc.setFontSize(10);
                doc.text(t('components.pdf.project.competencies'), 12, startY, { align: 'left' });
                doc.text(t('components.pdf.project.empty'), 64, startY, { align: 'left' });

                startY += 6;

                doc.text(t('components.pdf.project.exp'), 12, startY, { align: 'left' });
                doc.text(t('components.pdf.project.empty'), 64, startY, { align: 'left' });

                startY += 6;

                doc.text(t('components.pdf.project.rate'), 12, startY, { align: 'left' });
                doc.text(String(req.max_price) || t('components.pdf.project.empty'), 64, startY, { align: 'left' });
            });

            return doc;
        }
    }, [data]);

    const onPrint = useCallback((e: MouseEvent): void => {
        e.preventDefault();

        const doc = generatePdf();

        if(doc) {
            const blob = doc.output('bloburl');

            window.open(blob.toString());
            doc.close();
        }
    }, []);

    return (
        <div className={cn('pdf')}>
            <Button className={cn('pdf__button')} onClick={onPrint}>
                Скачать pdf
            </Button>
        </div>
    );
};

export default ProjectRequestPdf;
