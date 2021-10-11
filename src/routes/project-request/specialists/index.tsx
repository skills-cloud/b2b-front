import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarYears } from 'date-fns';
import { useForm, FormProvider } from 'react-hook-form';

import useClassnames from 'hook/use-classnames';
import { useDispatch } from 'component/core/store';

import IconStar from 'component/icons/star';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Checkbox from 'component/form/checkbox';

import { cv } from 'adapter/api/cv';
import { mainRequest } from 'adapter/api/main';
import { CvListReadFull, CvCareerRead, CvPositionCompetenceRead } from 'adapter/types/cv/cv/get/code-200';
import { OrganizationProjectCardItemReadTree } from 'adapter/types/main/organization-project-card-item/get/code-200';
import { RequestRequirementCvRead } from 'adapter/types/main/request-requirement/id/get/code-200';

import style from './index.module.pcss';

interface ICard extends OrganizationProjectCardItemReadTree{
    count: number
}

type TCardMap = Record<number, OrganizationProjectCardItemReadTree>;
type TCardList = Array<OrganizationProjectCardItemReadTree>;
type TUniqRootCard = Record<number, ICard>;

type TCvList = CvListReadFull & RequestRequirementCvRead;

const getMapFromTree = (
    list: TCardList,
    treeMap?: TCardMap
) => {
    const result = treeMap || {};

    list.forEach((item) => {
        if(item.id) {
            result[item.id] = item;
        }

        if(item.children.length > 0) {
            getMapFromTree(item.children, result);
        }
    });

    return result;
};

const getRootNode = (treeMap: TCardMap, id: number): OrganizationProjectCardItemReadTree => {
    const parentId = treeMap[id]?.parent_id;

    if(parentId) {
        return getRootNode(treeMap, parentId);
    }

    return treeMap[id];
};

const getTreeIds = (rootIds: Array<string>, cards: TCardMap, ids: Array<string> = []) => {
    rootIds.forEach((id) => {
        ids.push(String(id));

        if(cards[id].children.length > 0) {
            return getTreeIds(cards[id].children.map((item: OrganizationProjectCardItemReadTree) => item.id), cards, ids);
        }
    });

    return ids;
};

const ALL_CARD_MODAL_ID = 0;
const APPLY_CARD_FORM_ID = 'APPLY_CARD_FORM_ID';

export const Specialists = () => {
    const cn = useClassnames(style);
    const dispatch = useDispatch();
    const { hash } = useLocation();
    const { requestId } = useParams<{ requestId: string }>();
    const { t, i18n } = useTranslation();
    const methods = useForm();

    const { data, isLoading } = mainRequest.useGetMainRequestByIdQuery({ id: requestId });
    const [post] = mainRequest.usePostRequestRequirementCvSetDetailsMutation();
    const [cvList, setCvList] = useState<Array<TCvList>>([]);
    const [cards, setCards] = useState<TCardMap>({});
    const [cardTree, setCardTree] = useState<TCardList>([]);
    const [visibleModal, setVisibleModal] = useState<number | null>(null);

    useEffect(() => {
        const reqsList = data?.requirements?.reduce((acc, current) => {
            if(current.cv_list_ids) {
                current.cv_list_ids.forEach((cvId) => {
                    if(!acc.includes(parseInt(cvId, 10))) {
                        acc.push(parseInt(cvId, 10));
                    }
                });
            }

            return acc;
        }, [] as Array<number>);
        const reqsCvList = data?.requirements?.reduce((acc, current) => {
            if(current.cv_list) {
                current.cv_list.forEach((cvItem) => {
                    if(!acc.find((findItem) => findItem.id === cvItem.cv_id)) {
                        acc.push({
                            ...cvItem.cv,
                            request_requirement_id             : cvItem.request_requirement_id,
                            organization_project_card_items_ids: cvItem.organization_project_card_items_ids
                        });
                    }
                });
            }

            return acc;
        }, [] as Array<RequestRequirementCvRead>);

        if(reqsList && reqsCvList) {
            dispatch(cv.endpoints.getCvList.initiate({
                id: reqsList
            }))
                .then(({ data: respData }) => {
                    if(respData) {
                        const results = respData.results.map((result) => {
                            return {
                                ...reqsCvList.find((reqResult) => (reqResult.id === result.id) && reqResult),
                                ...result
                            };
                        });

                        setCvList(results);
                    }
                })
                .catch(console.error);
        }

        if(data?.project_id) {
            dispatch(mainRequest
                .endpoints
                .getOrganizationProjectCardItem
                .initiate({ organization_project_id: [String(data.project_id)] })
            ).then(({ data: cardItems }) => {
                if(cardItems) {
                    setCardTree(cardItems);
                    setCards(getMapFromTree(cardItems));
                }
            }).catch(console.error);
        }
    }, [JSON.stringify(data)]);

    const elAdditionalBlock = (cvItem?: CvCareerRead) => {
        if(cvItem) {
            const dateFrom = cvItem.date_from ? new Date(cvItem.date_from) : new Date();
            const dateTo = cvItem.date_to ? new Date(cvItem.date_to) : new Date();
            const experience = differenceInCalendarYears(dateTo, dateFrom);

            return (
                <div className={cn('specialists__user-info-block')}>
                    <div className={cn('specialists__user-info-exp')}>
                        <div className={cn('specialists__user-info-exp-years')}>
                            {t('routes.specialists.main.experience', {
                                count: experience
                            })}
                        </div>
                        <div className={cn('specialists__user-info-exp-stars')}>
                            <IconStar svg={{ className: cn('specialists__user-info-exp-star-icon') }} />
                            {experience}
                        </div>
                    </div>
                </div>
            );
        }
    };

    const elCompetencies = (competencies?: Array<CvPositionCompetenceRead>) => {
        if(competencies?.length) {
            return (
                <div className={cn('specialists__competencies')}>
                    {competencies.map((comp) => (
                        <div key={comp.competence_id} className={cn('specialists__competence')}>
                            {comp.competence?.name}
                        </div>
                    ))}
                </div>
            );
        }

        return '\u2014';
    };

    const elUserItem = (cvItem: TCvList) => {
        const firstName = cvItem.first_name;
        const lastName = cvItem.last_name;
        let title = `${firstName || ''} ${lastName || ''}`.trim();
        const subTitle = cvItem.career?.[0]?.position?.name || '\u2014';
        let rootCard = {};

        if(!firstName && !lastName) {
            title = t('routes.specialists.main.first-name');
        }

        if(Object.keys(cards).length > 0 && cvItem?.organization_project_card_items_ids) {
            rootCard = cvItem
                .organization_project_card_items_ids
                .map((id: number) => getRootNode(cards, id))
                .reduce((result: TUniqRootCard, item: OrganizationProjectCardItemReadTree) => {
                    if(!item?.id) {
                        return result;
                    }

                    if(result[item.id]) {
                        result[item.id].count += 1;
                    } else {
                        result[item.id] = {
                            ...item,
                            count: 1
                        };
                    }

                    return result;
                }, {});
        }

        const setForm = () => {
            if(!cvItem.organization_project_card_items_ids) {
                return;
            }

            cvItem
                .organization_project_card_items_ids
                .forEach((id: number) => {
                    methods.setValue(`card-${id}`, true);
                });

            methods.setValue('cv_id', cvItem.id);
            methods.setValue('requestId', cvItem.request_requirement_id);
        };

        return (
            <div key={cvItem.id} className={cn('specialists__user')}>
                <div className={cn('specialists__user-info')}>
                    <UserAvatar
                        className={cn('specialists__user-info-avatar')}
                        title={title}
                        subTitle={subTitle}
                        titleTo={`/specialists/${cvItem.id}`}
                        avatar={{
                            src: cvItem.photo
                        }}
                    />
                    {elAdditionalBlock(cvItem.career?.[0])}
                </div>
                <div className={cn('specialists__user-competencies')}>
                    <p className={cn('specialists__block-title')}>
                        {t('routes.specialists.main.competencies')}
                    </p>
                    {elCompetencies(cvItem.positions?.[0]?.competencies)}
                </div>
                <div className={cn('specialists__column')}>
                    <div className={cn('specialists__user-rate')}>
                        <p className={cn('specialists__block-title')}>
                            {t('routes.specialists.main.rate')}
                        </p>
                        {cvItem.price || '\u2014'}
                    </div>
                    {!!cvItem?.organization_project_card_items_ids && (
                        <div className={cn('specialists__user-cards')}>
                            <p className={cn('specialists__block-title')}>
                                {t('routes.specialists.main.cards')}
                            </p>
                            {Object.keys(rootCard).map((id: string) => {
                                const item: ICard = rootCard[id];

                                return (
                                    <span
                                        key={item.id}
                                        className={cn('specialists__user-card')}
                                        onClick={() => {
                                            if(item.id) {
                                                setVisibleModal(item.id);
                                                setForm();
                                            }
                                        }}
                                    >
                                        {item.name}
                                        ({item.count})
                                    </span>
                                );
                            })}

                            <span
                                className={cn('specialists__link')}
                                onClick={() => {
                                    setVisibleModal(ALL_CARD_MODAL_ID);
                                    setForm();
                                }}
                            >
                                {t('routes.specialists.main.cards-add')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const elUsers = useMemo(() => {
        if(isLoading) {
            return <Loader />;
        }

        if(data?.requirements?.length) {
            const hashValue = hash.slice(1);
            const cvListFiltered = cvList.filter((item) => item.requests_requirements?.find((req) => String(req.id) === hashValue));
            const dataToRender = hashValue === 'all' ? cvList : cvListFiltered;

            if(dataToRender?.length) {
                return (
                    <div className={cn('specialists__users')}>
                        {dataToRender.map((cvItem) => elUserItem(cvItem))}
                    </div>
                );
            }

            return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
        }

        return <span className={cn('specialists__users-empty')}>{t('routes.specialists.main.users.empty')}</span>;
    }, [JSON.stringify(data?.requirements), JSON.stringify(cvList), hash, i18n.language, isLoading]);

    const renderTree = (cardList: TCardList, level?: number) => {
        const currentLevel = level || 0;

        return cardList.map((item) => (
            <React.Fragment key={item.id}>
                {level === undefined && <div className={cn('specialists__modal-content-title')}>{item.name}</div>}
                {item.children.length > 0 && (
                    <div className={cn('specialists__modal-content-list')}>
                        {renderTree(item.children, currentLevel + 1)}
                    </div>)}
                {level !== undefined && (
                    <Checkbox
                        name={`card-${item.id}`}
                        label={item.name}
                        className={{
                            'checkbox__label': cn('specialists__modal-card-checkbox')
                        }}
                    />
                )}
            </React.Fragment>
        ));
    };

    const renderCard = cardTree.filter((item) => item.id === visibleModal);

    const applyCardForm = (formValues: Record<string, string | boolean>) => {
        const { cv_id, requestId: formRequestId, ...values } = formValues;
        const falsyRootIds = Object.keys(values)
            .filter((item) => !values[item])
            .map((item) => item.slice('card-'.length))
            .filter((item) => cards[item].parent_id === null);
        const falsyIds = getTreeIds(falsyRootIds, cards);
        const cardIds = Object.keys(values)
            .filter((item) => values[item])
            .map((item) => item.slice('card-'.length))
            .filter((id) => !falsyIds.includes(id));

        post({
            id   : hash.slice(1) === 'all' ? formRequestId as string : hash.slice(1),
            cv_id: String(cv_id),
            data : {
                organization_project_card_items_ids: cardIds
            }
        })
            .unwrap()
            .then(() => {
                setVisibleModal(null);
            })
            .catch(console.error);
    };

    return (
        <section className={cn('specialists')}>
            <h2 className={cn('specialists__header')}>{t('routes.specialists.main.title')}</h2>
            {elUsers}
            {visibleModal !== null && (
                <Modal
                    header={
                        t('routes.specialists.modal-card.title', {
                            name   : renderCard.length === 1 ? renderCard[0].name : '',
                            context: renderCard.length === 1 ? 'current' : 'add'
                        })
                    }
                    footer={
                        <ModalFooterSubmit>
                            <Button
                                isSecondary={true} onClick={() => {
                                    setVisibleModal(null);
                                }}
                            >
                                {t('routes.specialists.modal-card.cancel')}
                            </Button>
                            <Button form={APPLY_CARD_FORM_ID} type="submit">
                                {t('routes.specialists.modal-card.submit')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                    onClose={() => {
                        setVisibleModal(null);
                    }}
                >
                    <FormProvider {...methods}>
                        <form method="POST" onSubmit={methods.handleSubmit(applyCardForm)} id={APPLY_CARD_FORM_ID}>
                            {renderCard.length === 1 && renderTree(renderCard[0].children)}
                            {renderCard.length === 0 && cardTree.map((item) => (
                                <Checkbox
                                    key={item.id}
                                    name={`card-${item.id}`}
                                    label={item.name}
                                    className={{
                                        'checkbox__label': cn('specialists__modal-card-checkbox')
                                    }}
                                />
                            ))}
                        </form>
                    </FormProvider>
                </Modal>
            )}
        </section>
    );
};

export default Specialists;
