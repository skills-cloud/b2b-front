import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { useParams } from 'react-router';
import debounce from 'lodash.debounce';

import { IParams } from 'helper/url-list';
import useClassnames from 'hook/use-classnames';

import FormInput from 'component/form/input';
import FormDate from 'component/form/date';
import InputSelect from 'component/form/select';
import ErrorsComponent from 'component/error/errors';
import InputDictionary from 'component/form/input-dictionary';
import Textarea from 'component/form/textarea';

import { useDispatch } from 'component/core/store';
import { dictionary } from 'adapter/api/dictionary';
import { CvProjectRead } from 'adapter/types/cv/project/get/code-200';
import { project } from 'adapter/api/project';

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
    const { specialistId } = useParams<IParams>();
    const methods = useForm(props.defaultValues);

    const [postProject, { isLoading: isPostLoading, isError, error }] = project.usePostProjectMutation();
    const [patchProject, { isLoading: isPatchLoading, isError: isPatchError, error: patchError }] = project.usePatchProjectByIdMutation();
    const [getOrganizations] = dictionary.useLazyGetOrganizationQuery(undefined);

    useEffect(() => {
        props.onSetLoading?.(isPatchLoading || isPostLoading);
    }, [isPostLoading, isPatchLoading]);

    const onSubmit = methods.handleSubmit((formData) => {
        const data = {
            ...formData.project,
            cv_id           : parseInt(specialistId, 10),
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
            .catch(console.error);
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

    return (
        <FormProvider {...methods}>
            <form id="projects-form" onSubmit={onSubmit}>
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
                            loadOptions={(value, cb) => {
                                getOrganizations({
                                    search   : value,
                                    page_size: 1000
                                })
                                    .unwrap()
                                    .then(({ results }) => {
                                        cb(
                                            results.map((organization) => ({
                                                value: organization.id,
                                                label: organization.name
                                            }))
                                        );
                                    });
                            }}
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
                        <InputDictionary
                            requestType={InputDictionary.requestType.Competence}
                            name="project.competencies_select"
                            placeholder={t('routes.person.projects.fields.placeholder.competencies')}
                        />
                    </div>
                    <Textarea
                        direction={Textarea.direction.Column}
                        name="project.description"
                        label={t('routes.person.projects.fields.description')}
                    />
                </div>
            </form>
            <ErrorsComponent error={error || patchError} isError={isError || isPatchError} isLoading={isPostLoading || isPatchLoading} />
        </FormProvider>
    );
};

export default CareerForm;
