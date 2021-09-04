import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce';

import useClassnames from 'hook/use-classnames';
import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import FormInputSkills from 'component/form/input-skills';
import InputSelect from 'component/form/select';
import Error from 'component/error';

import { useDispatch } from 'component/core/store';
import { dictionary } from 'adapter/api/dictionary';
import { CvProjectRead } from 'adapter/types/cv/project/get/code-200';
import { project } from 'adapter/api/project';
import { mainRequest } from 'adapter/api/main';

import style from './index.module.pcss';

export interface IResultForm extends Omit<CvProjectRead, 'competencies_select' | 'organization' | 'position'> {
    competencies_select: Array<{
        value?: number,
        label: string
    }>,
    organization: {
        value?: number,
        label: string
    },
    position: {
        value?: number,
        label: string
    }
}

interface IProjectForm {
    defaultValues: { defaultValues: { project: IResultForm } } | undefined,
    onSetLoading: (loading: boolean) => void,
    onSubmit?: () => void
}

const CareerForm = (props: IProjectForm) => {
    const dispatch = useDispatch();
    const cn = useClassnames(style);
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const methods = useForm(props.defaultValues);
    const [postProject, { isLoading: isPostLoading }] = project.usePostProjectMutation();
    const [patchProject, { isLoading: isPatchLoading }] = project.usePatchProjectByIdMutation();
    const { data: dataOrganizationList } = mainRequest.useGetMainOrganizationQuery(undefined);

    const [error, setError] = useState<Array<string> | string | null>(null);

    useEffect(() => {
        props.onSetLoading?.(isPatchLoading || isPostLoading);
    }, [isPostLoading, isPatchLoading]);

    const onChangeForm = () => {
        setError(null);
    };

    const onSubmit = methods.handleSubmit((formData) => {
        const data = {
            ...formData.project,
            cv_id           : parseInt(id, 10),
            competencies_ids: formData.project?.competencies_select?.map(({ value }) => value) || [],
            organization_id : formData.project?.organization?.value,
            position_id     : formData.project?.position?.value
        };
        const request = formData.project.id ? patchProject(data) : postProject(data);

        request
            .unwrap()
            .then(() => {
                props.onSubmit?.();
            })
            .catch((err) => {
                console.error(err);

                if(typeof err.data?.details === 'object') {
                    setError(Object.keys(err.data?.details).map((item) => `${item}: ${err.data?.details[item]}`));
                } else {
                    setError(err.data?.status);
                }
            });
    });

    const onLoadPositionOptions = debounce((search_string: string, callback) => {
        dispatch(dictionary.endpoints.getPositionList.initiate({
            search: search_string
        }))
            .then(({ data }) => {
                if(data?.results?.length) {
                    const res = data.results.map((item) => ({
                        label: item.name,
                        value: String(item.id)
                    }));

                    callback(res);
                } else {
                    callback(null);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, 150);

    const elError = useMemo(() => {
        if(error) {
            if(Array.isArray(error)) {
                return error.map((item, index) => (
                    <Error
                        key={index}
                        className={cn('competencies-edit__error')}
                        elIcon={true}
                    >
                        {item}
                    </Error>
                ));
            }

            return <Error className={cn('competencies-edit__error')} elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <FormProvider {...methods}>
            <form id="projects-form" onSubmit={onSubmit} onChange={onChangeForm}>
                <div className={cn('projects-form')}>
                    <div className={cn('projects-form__item')}>
                        <label className={cn('projects-form__label')}>
                            {t('routes.person.projects.fields.name')}
                        </label>
                        <FormInput name="project.name" type="text" required={true} />
                    </div>
                    <div className={cn('projects-form__item', 'projects-form__item_dates')}>
                        <label className={cn('projects-form__label')}>
                            {t('routes.person.projects.fields.date')}
                        </label>
                        <FormDate name="project.date_from" />
                        &mdash;
                        <FormDate name="project.date_to" />
                    </div>
                    <div className={cn('projects-form__item')}>
                        <label className={cn('projects-form__label')}>
                            {t('routes.person.projects.fields.customer')}
                        </label>
                        <InputSelect
                            name="project.organization"
                            options={dataOrganizationList?.results.map((result) => ({ label: result.name, value: String(result.id) })) || []}
                            placeholder={t('routes.person.projects.fields.placeholder.organization')}
                            required={true}
                        />
                    </div>
                    <div className={cn('projects-form__item')}>
                        <label className={cn('projects-form__label')}>
                            {t('routes.person.projects.fields.position')}
                        </label>
                        <InputSelect
                            name="project.position"
                            loadOptions={onLoadPositionOptions}
                            placeholder={t('routes.person.projects.fields.placeholder.position')}
                            required={true}
                        />
                    </div>
                    <div className={cn('projects-form__item')}>
                        <label className={cn('projects-form__label')}>
                            {t('routes.person.projects.fields.competencies')}
                        </label>
                        <FormInputSkills
                            name="project.competencies_select"
                            placeholder={t('routes.person.projects.fields.placeholder.competencies')}
                        />
                    </div>
                    <div className={cn('projects-form__item')}>
                        <label className={cn('projects-form__label')}>
                            {t('routes.person.projects.fields.description')}
                        </label>
                        <FormInput name="project.description" type="text" />
                    </div>
                </div>
            </form>
            {elError}
        </FormProvider>
    );
};

export default CareerForm;
