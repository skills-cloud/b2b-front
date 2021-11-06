import React, { MouseEvent, useCallback } from 'react';
import { useParams } from 'react-router';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';

import { mainRequest } from 'adapter/api/main';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { callAddFont } from './font.ts';
import Base from '../index';

jsPDF.API.events.push(['addFonts', callAddFont]);

const ProjectRequestPdf = () => {
    const { t } = useTranslation();

    const params = useParams<{ subpage?: string, requestId: string }>();
    const { data, refetch } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.requestId },
        { refetchOnMountOrArgChange: true }
    );

    const generatePdf = useCallback((): jsPDF | undefined => {
        if(data) {
            const doc = new jsPDF('p', 'pt', 'a4');
            let startY = 30;
            const startX = 12;
            const startXColumn = 160;

            doc.addFont('Roboto-Medium-normal.ttf', 'Roboto-Medium', 'normal');
            doc.setFont('Roboto-Medium', 'normal');

            doc.setFontSize(20);
            doc.text(data.module?.organization_project?.name || t('components.pdf.project.name'), startX, startY, { align: 'left' });

            startY += 30;

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.main-info'), startX, startY, { align: 'left' });

            startY += 20;

            doc.setFontSize(10);
            doc.text(t('components.pdf.project.sector'), startX, startY, { align: 'left' });
            doc.text(data.industry_sector?.name || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            startY += 16;

            doc.text(t('components.pdf.project.project'), startX, startY, { align: 'left' });
            doc.text(data.module?.organization_project?.name || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            const manager = `${data.resource_manager?.last_name || ''} ${(data.resource_manager?.first_name || '').slice(0, 1)}`;

            startY += 16;

            doc.text(t('components.pdf.project.manager'), startX, startY, { align: 'left' });
            doc.text(manager.trim() || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            const recruiter = `${data.recruiter?.last_name || ''} ${(data.recruiter?.first_name || '').slice(0, 1)}`;

            startY += 16;

            doc.text(t('components.pdf.project.recruiter'), startX, startY, { align: 'left' });
            doc.text(recruiter.trim() || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            startY += 16;

            doc.text(t('components.pdf.project.type'), startX, startY, { align: 'left' });
            doc.text(data.type?.name || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            startY += 16;

            doc.text(t('components.pdf.project.customer'), startX, startY, { align: 'left' });
            doc.text(data.module?.organization_project?.organization?.name || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            startY += 30;

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.time'), startX, startY, { align: 'left' });

            startY += 20;

            doc.setFontSize(10);
            doc.text(t('components.pdf.project.time'), startX, startY, { align: 'left' });
            doc.text(t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            startY += 16;

            doc.text(t('components.pdf.project.long'), startX, startY, { align: 'left' });
            doc.text(t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            startY += 30;

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.reqs'), startX, startY, { align: 'left' });

            data.requirements?.forEach((req) => {
                startY += 30;

                doc.setFontSize(14);
                doc.text(req.name || t('components.pdf.project.req-empty'), startX, startY, { align: 'left' });

                startY += 20;

                doc.setFontSize(12);
                doc.text(t('components.pdf.project.position', {
                    position: req.position?.name,
                    count   : req.count,
                    context : req.position?.name ? 'default' : 'empty'
                }), startX, startY, { align: 'left' });

                startY += 20;

                const textCompetencies = doc.splitTextToSize(req.competencies?.map((comp) => comp.competence?.name).join(', ') || '', 500);
                const splatTextLength = textCompetencies.length;

                doc.setFontSize(10);
                doc.text(t('components.pdf.project.competencies'), startX, startY, { align: 'left' });
                doc.text(textCompetencies || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

                const coefficient = splatTextLength > 1 ? (16 * (0.85 - splatTextLength / 100)) * splatTextLength : 16;

                startY = startY + coefficient;

                const exp = req.experience_years ? String(req.experience_years) : t('components.pdf.project.empty');

                doc.text(t('components.pdf.project.exp'), startX, startY, { align: 'left' });
                doc.text(exp, startXColumn, startY, { align: 'left' });

                startY += 16;

                const rate = req.max_price ? String(req.max_price) : t('components.pdf.project.empty');

                doc.text(t('components.pdf.project.rate'), startX, startY, { align: 'left' });
                doc.text(rate, startXColumn, startY, { align: 'left' });
            });

            startY += 30;

            doc.setFontSize(16);
            doc.text(t('components.pdf.project.customer'), startX, startY, { align: 'left' });

            startY += 16;

            doc.setFontSize(10);
            doc.text(t('components.pdf.project.customer'), startX, startY, { align: 'left' });
            doc.text(data.module?.organization_project?.organization?.name || t('components.pdf.project.empty'), startXColumn, startY, { align: 'left' });

            return doc;
        }
    }, [data]);

    const onPrint = useCallback((e: MouseEvent): void => {
        e.preventDefault();
        refetch();

        const doc = generatePdf();

        if(doc) {
            const blob = doc.output('bloburl');

            window.open(blob.toString());
            doc.close();
        }
    }, []);

    return (
        <Base onClick={onPrint}>
            {t('components.pdf.download')}
        </Base>
    );
};

export default ProjectRequestPdf;
