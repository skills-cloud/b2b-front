import React, { MouseEvent, useCallback, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';

import { IParams } from 'helper/url-list';

import { mainRequest } from 'adapter/api/main';

import Base from '../index';

const COL_SPAN_FULL = 10;
const COL_SPAN_LABEL = 3;
const COL_SPAN_VALUE = 7;

const ProjectRequestCsv = () => {
    const { t } = useTranslation();

    const params = useParams<IParams>();
    const { data, refetch } = mainRequest.useGetMainRequestByIdQuery(
        { id: params.requestId },
        { refetchOnMountOrArgChange: true }
    );

    const elRow = (label: string, value?: string) => {
        return (
            <tr>
                <td colSpan={COL_SPAN_LABEL}>{label}</td>
                <td colSpan={COL_SPAN_VALUE}>{value || t('components.pdf.project.empty')}</td>
            </tr>
        );
    };

    const elTable = () => {
        if(data) {
            const manager = `${data.resource_manager?.last_name || ''} ${(data.resource_manager?.first_name || '').slice(0, 1)}`;
            const recruiter = `${data.recruiter?.last_name || ''} ${(data.recruiter?.first_name || '').slice(0, 1)}`;

            return (
                <table>
                    <thead>
                        <tr>
                            <th colSpan={COL_SPAN_FULL}>{data.module?.organization_project?.name || t('components.pdf.project.name')}</th>
                            <th colSpan={COL_SPAN_FULL} />
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        <tr><td colSpan={COL_SPAN_FULL}>{t('components.pdf.project.main-info')}</td></tr>
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        {elRow(t('components.pdf.project.sector'), data.industry_sector?.name)}
                        {elRow(t('components.pdf.project.project'), data.module?.organization_project?.name)}
                        {elRow(t('components.pdf.project.manager'), manager)}
                        {elRow(t('components.pdf.project.recruiter'), recruiter)}
                        {elRow(t('components.pdf.project.type'), data.type?.name)}
                        {elRow(t('components.pdf.project.customer'), data.module?.organization_project?.organization?.name)}
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        <tr><td colSpan={COL_SPAN_FULL}>{t('components.pdf.project.time')}</td></tr>
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        {elRow(t('components.pdf.project.time'), t('components.pdf.project.empty'))}
                        {elRow(t('components.pdf.project.long'), t('components.pdf.project.empty'))}
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        <tr><td colSpan={COL_SPAN_FULL}>{t('components.pdf.project.reqs')}</td></tr>
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        {data?.requirements?.map((requirement, index) => {
                            const exp = requirement.experience_years ? String(requirement.experience_years) : t('components.pdf.project.empty');
                            const rate = requirement.max_price ? String(requirement.max_price) : t('components.pdf.project.empty');

                            return (
                                <Fragment key={requirement.id}>
                                    {index > 0 && <tr><td colSpan={COL_SPAN_FULL} /></tr>}
                                    <tr><td colSpan={COL_SPAN_FULL}>{requirement.name || t('components.pdf.project.req-empty')}</td></tr>
                                    <tr>
                                        <td colSpan={COL_SPAN_FULL}>{t('components.pdf.project.position', {
                                            position: requirement.position?.name,
                                            count   : requirement.count,
                                            context : requirement.position?.name ? 'default' : 'empty'
                                        })}
                                        </td>
                                    </tr>
                                    {elRow(t('components.pdf.project.competencies'), requirement.competencies?.map((comp) => comp.competence?.name).join(', '))}
                                    {elRow(t('components.pdf.project.exp'), exp)}
                                    {elRow(t('components.pdf.project.rate'), rate)}
                                </Fragment>
                            );
                        })}
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        <tr><td colSpan={COL_SPAN_FULL}>{t('components.pdf.project.customer')}</td></tr>
                        <tr><td colSpan={COL_SPAN_FULL} /></tr>
                        {elRow(t('components.pdf.project.customer'), data.module?.organization_project?.organization?.name)}
                    </tbody>
                </table>
            );
        }

        return <table />;
    };

    const onPrint = useCallback((e: MouseEvent): void => {
        e.preventDefault();
        refetch();

        if(data) {
            const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const ws = utils.table_to_sheet(ReactDOM.render(elTable(), document.getElementById('table')));
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = write(wb, { bookType: 'xlsx', type: 'array' });
            const blobCsv = new Blob([excelBuffer], { type: fileType });

            saveAs(blobCsv, 'request.xlsx');
        }
    }, [data]);

    return (
        <Base onClick={onPrint}>
            <div id="table" hidden={true} />
            {t('components.xlsx.download')}
        </Base>
    );
};

export default ProjectRequestCsv;
