import i18n from 'i18next';
import {
    AlignmentType,
    BorderStyle,
    Document,
    HeadingLevel,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    WidthType
} from 'docx';
import { RequestRead, RequestRequirementRead, Organization } from 'adapter/types/main/request/id/get/code-200';

class DocumentCreator {
    public borderStyle = { style: BorderStyle.NONE, size: 0, color: '#FFFFFF' };

    public noBorders = {
        top   : this.borderStyle,
        bottom: this.borderStyle,
        left  : this.borderStyle,
        right : this.borderStyle
    };

    public create(props: RequestRead): Document {
        return new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            text   : props.project?.name || i18n.t('components.pdf.project.name'),
                            heading: HeadingLevel.HEADING_1,
                            spacing: { after: 200 }
                        }),
                        new Paragraph({
                            text   : i18n.t('components.pdf.project.main-info'),
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 100 }
                        }),
                        this.createBasicInfo(props),
                        new Paragraph({
                            text   : i18n.t('components.pdf.project.time'),
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 200 }
                        }),
                        this.createProjectTime(),
                        new Paragraph({
                            text   : i18n.t('components.pdf.project.reqs'),
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 200 }
                        }),
                        ...this.createProjectReqs(props.requirements),
                        new Paragraph({
                            text   : i18n.t('components.pdf.project.customer'),
                            heading: HeadingLevel.HEADING_2,
                            spacing: { before: 200, after: 200 }
                        }),
                        this.createCustomer(props.organization_project?.organization)
                    ]
                }
            ]
        });
    }

    public createRow(label: string, value?: string) {
        return new TableRow({
            children: [
                new TableCell({
                    borders : this.noBorders,
                    margins : { bottom: 50 },
                    width   : { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph(label)]
                }),
                new TableCell({
                    borders : this.noBorders,
                    width   : { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph(value ?? i18n.t('components.pdf.project.empty'))]
                })
            ]
        });
    }

    public createBasicInfo(data: RequestRead): Table {
        const manager = `${data.resource_manager?.last_name || ''} ${(data.resource_manager?.first_name || '').slice(0, 1)}`;
        const recruiter = `${data.recruiter?.last_name || ''} ${(data.recruiter?.first_name || '').slice(0, 1)}`;

        return new Table({
            alignment: AlignmentType.LEFT,
            rows     : [
                this.createRow(i18n.t('components.pdf.project.sector'), data.industry_sector?.name),
                this.createRow(i18n.t('components.pdf.project.project'), data.project?.name),
                this.createRow(i18n.t('components.pdf.project.manager'), manager),
                this.createRow(i18n.t('components.pdf.project.recruiter'), recruiter),
                this.createRow(i18n.t('components.pdf.project.customer'), data.organization_project?.organization?.name),
                this.createRow(i18n.t('components.pdf.project.sector'), data.industry_sector?.name)
            ]
        });
    }

    public createProjectTime(): Table {
        return new Table({
            alignment: AlignmentType.LEFT,
            rows     : [
                this.createRow(i18n.t('components.pdf.project.time'), i18n.t('components.pdf.project.empty')),
                this.createRow(i18n.t('components.pdf.project.long'), i18n.t('components.pdf.project.empty'))
            ]
        });
    }

    public createProjectReqs(data?: Array<RequestRequirementRead>) {
        return data?.map((req, index) => [
            new Paragraph({
                text   : req.name || i18n.t('components.pdf.project.req-empty'),
                heading: HeadingLevel.HEADING_3,
                spacing: { after: 100, before: index > 0 ? 200 : 0 }
            }),
            new Paragraph({
                text: i18n.t('components.pdf.project.position', {
                    position: req.position?.name,
                    count   : req.count,
                    context : req.position?.name ? 'default' : 'empty'
                }),
                heading: HeadingLevel.HEADING_4,
                spacing: { after: 100, before: index > 0 ? 100 : 0 }
            }),
            new Table({
                alignment: AlignmentType.LEFT,
                rows     : [
                    this.createRow(i18n.t('components.pdf.project.competencies'), req.competencies?.map((comp) => comp.competence?.name).join(', ')) || i18n.t('components.pdf.project.empty'),
                    this.createRow(i18n.t('components.pdf.project.exp'), req.experience_years ? String(req.experience_years) : i18n.t('components.pdf.project.empty')),
                    this.createRow(i18n.t('components.pdf.project.rate'), req.max_price ? String(req.max_price) : i18n.t('components.pdf.project.empty'))
                ]
            })
        ]).reduce((prev, curr) => prev.concat(curr), []) || [];
    }

    public createCustomer(data?: Organization) {
        return new Table({
            alignment: AlignmentType.LEFT,
            rows     : [
                this.createRow(i18n.t('components.pdf.project.customer'), data?.name || i18n.t('components.pdf.project.empty'))
            ]
        });
    }
}

export default DocumentCreator;
