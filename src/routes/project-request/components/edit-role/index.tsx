import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';

import { dictionary } from 'adapter/api/dictionary';
import { CompetenceTree } from 'adapter/types/dictionary/competence-tree/get/code-200';
import { mainRequest } from 'adapter/api/main';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import CheckboxTree from 'react-checkbox-tree';
import IconChevronDown from 'component/icons/chevron-down';
import IconChevronRight from 'component/icons/chevron-right';
import IconLoader from 'component/icons/loader';
import Input from 'component/form/input';
import Button from 'component/button';
import { useClassnames } from 'hook/use-classnames';

import { RequestRequirementRead } from 'adapter/types/main/request-requirement/id/get/code-200';

import style from './index.module.pcss';

interface INodeCheckboxTree {
    label: React.ReactNode,
    value: string,
    children?: Array<INodeCheckboxTree>,
    className?: string,
    disabled?: boolean,
    icon?: React.ReactNode,
    showCheckbox?: boolean,
    title?: string
}

const EDIT_ROLE_FORM_ID = 'EDIT_ROLE_FORM_ID';

interface IEditRole {
    onBack: () => void,
    onClose: () => void,
    requirements: RequestRequirementRead
}

interface ICompetenceMap {
    [key: number]: CompetenceTree
}

const convertDataToCheckboxTree = (array: Array<CompetenceTree>, mapCompetence?: ICompetenceMap) => (
    array.map((item): INodeCheckboxTree => {
        const { id, name, children } = item;

        if(mapCompetence && id) {
            mapCompetence[id] = item;
        }

        return {
            value       : String(id),
            label       : name,
            showCheckbox: true,
            children    : children?.length ? convertDataToCheckboxTree(children, mapCompetence) : undefined
        };
    })
);

const walkTree = (items: Array<CompetenceTree>, callback: (model: CompetenceTree) => void) => {
    items?.forEach((item) => {
        callback(item);

        if(item.children?.length) {
            walkTree(item.children, callback);
        }
    });
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const getRootNode: CompetenceTree = (
    model: CompetenceTree,
    nodeById: ICompetenceMap,
    newNodeById: ICompetenceMap
) => {
    const parent_id = model?.parent_id;
    const parentModel = parent_id ? nodeById[parent_id] : null;

    if(parentModel) {
        newNodeById[parentModel.id] = {
            ...parentModel,
            children: parentModel?.children?.filter(({ id }: {id: number}) => id === model.id)
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return getRootNode(parentModel, nodeById, newNodeById);
    }

    return model;
};

const EditRole = ({ onBack, onClose, requirements }: IEditRole) => {
    const { t } = useTranslation();
    const cn = useClassnames(style);
    const form = useForm();
    const { data } = dictionary.useGetCompetenceTreeQuery(undefined);
    const [post] = mainRequest.usePostRequestRequirementCompetenciesSetMutation();
    const nodeById = useRef({});
    const [expanded, setExpanded] = useState<Array<string>>([]);
    const [checked, setChecked] = useState<Array<string>>(
        requirements.competencies?.map(({ competence }) => String(competence?.id)) || []
    );
    const searchString = form.getValues('search')?.trim();
    let nextData = data;
    const newNodeById: ICompetenceMap = {};
    const setNodes = new Set<number>();

    if(searchString && data) {
        walkTree(data, (model: CompetenceTree) => {
            const name = model.name.toLowerCase();

            if(~name.search(searchString.trim().toLowerCase())) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const rootNode = getRootNode(model, nodeById.current, newNodeById);

                setNodes.add(rootNode.id);
            }
        });

        nextData = [...setNodes].map((id: number) => newNodeById[id]);
    }

    useEffect(() => {
        if(searchString) {
            setExpanded([...setNodes].map((id) => id.toString()));
        } else {
            setExpanded([]);
        }
    }, [searchString]);

    const handleSubmit = () => {
        const requirementsId = requirements.id;

        if(!requirementsId) {
            return;
        }

        const competencies = checked.map((id) => ({
            competence_id: parseInt(id, 10)
        }));

        post({ id: requirementsId, competencies })
            .unwrap()
            .then(onClose)
            .catch(console.error);
    };

    return (
        <Modal
            onBack={onBack}
            header={requirements?.position?.name}
            footer={
                <ModalFooterSubmit>
                    <Button isSecondary={true} onClick={onBack}>
                        {t('routes.project-request.requirements.edit-modal.cancel')}
                    </Button>
                    <Button type="submit" form={EDIT_ROLE_FORM_ID}>
                        {t('routes.project-request.requirements.edit-modal.save')}
                    </Button>
                </ModalFooterSubmit>
            }
        >
            <div className="position">
                <FormProvider {...form}>
                    <form
                        method="POST"
                        id={EDIT_ROLE_FORM_ID}
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className={cn('form')}
                    >
                        <div className={cn('form-search')}>
                            <Input
                                placeholder={t('routes.project-request.requirements.edit-role.search')}
                                name="search"
                                type="text"
                            />
                        </div>
                        <div className={cn('form-checkbox-tree')}>
                            {!(data && nextData) && <div className={cn('form-loader')}><IconLoader /></div>}
                            {data && nextData && (
                                <CheckboxTree
                                    checked={checked}
                                    expanded={expanded}
                                    onCheck={(checkedValues) => {
                                        setChecked(checkedValues);
                                    }}
                                    onExpand={setExpanded}
                                    nodes={convertDataToCheckboxTree(
                                        nextData,
                                        !searchString ? nodeById.current : undefined
                                    )}
                                    optimisticToggle={true}
                                    icons={{
                                        check      : null,
                                        uncheck    : null,
                                        halfCheck  : null,
                                        expandOpen : <IconChevronDown svg={{ className: cn('competencies-edit__expand') }} />,
                                        expandClose: <IconChevronRight />,
                                        parentClose: null,
                                        parentOpen : null,
                                        leaf       : null
                                    }}
                                />
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Modal>
    );
};

export default EditRole;