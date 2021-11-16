import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarYears } from 'date-fns';
import { useForm, FormProvider } from 'react-hook-form';

import { IParams, SPECIALIST_ID } from 'src/helper/url-list';
import useClassnames from 'hook/use-classnames';

import IconStar from 'component/icons/star';
import UserAvatar from 'component/user/avatar';
import Loader from 'component/loader';
import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import InputDate from 'component/form/date';
import Checkbox from 'component/form/checkbox';
import StarRating from 'component/star-rating';

import { cv } from 'adapter/api/cv';
import { mainRequest } from 'adapter/api/main';
import { CvListReadFull, CvPositionCompetenceRead } from 'adapter/types/cv/cv/get/code-200';
import { OrganizationProjectCardItemReadTree } from 'adapter/types/main/organization-project-card-item/get/code-200';
import { RequestRequirementCvRead } from 'adapter/types/main/request-requirement/id/get/code-200';

import style from './index.module.pcss';

interface ICard extends OrganizationProjectCardItemReadTree{
    count: number
}

interface ICardMap extends OrganizationProjectCardItemReadTree{
    cardCount?: number
}

type TCardMap = Record<number, ICardMap>;
type TCardList = Array<OrganizationProjectCardItemReadTree>;
type TUniqRootCard = Record<number, ICard>;

type TCvList = Omit<CvListReadFull, 'rating' | 'projects'> & Omit<RequestRequirementCvRead, 'cv_id'>;

const getMapFromTree = (
    list: TCardList,
    treeMap?: TCardMap,
    rootNode?: ICardMap
) => {
    const result = treeMap || {};
    let nextRootNode = rootNode;

    list.forEach((item, index) => {
        if(item.id) {
            result[item.id] = item;
        }

        if(item.parent_id === null) {
            nextRootNode = list[index];
        }

        if(nextRootNode?.id && item.children.length === 0) {
            const count = result[nextRootNode.id]?.cardCount ?? 0;

            result[nextRootNode.id] = {
                ...nextRootNode,
                cardCount: count + 1
            };
        }

        if(item.children.length > 0) {
            getMapFromTree(item.children, result, nextRootNode);
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
            return getTreeIds(
                cards[id].children.map((item: OrganizationProjectCardItemReadTree) => item.id),
                cards,
                ids
            );
        }
    });

    return ids;
};

const ALL_CARD_MODAL_ID = 0;
const APPLY_CARD_FORM_ID = 'APPLY_CARD_FORM_ID';
const RATING_FORM_ID = 'RATING_FORM_ID';

const CardWrapper = ({ level, children }: {level?: number, children: ReactNode}) => {
    const cn = useClassnames(style);

    if(level === undefined) {
        return <div className={cn('candidates__modal-content-grid')}>{children}</div>;
    }

    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <React.Fragment>{children}</React.Fragment>;
};

export const Candidates = () => {
    const cn = useClassnames(style);
    const { hash } = useLocation();
    const { projectId, requestId } = useParams<IParams>();
    const { t } = useTranslation();
    const methods = useForm();

    const { data, isLoading } = mainRequest.useGetMainRequestByIdQuery({
        id: requestId
    }, {
        refetchOnMountOrArgChange: true
    });
    const { data: projectCardData } = mainRequest.useGetOrganizationProjectCardItemQuery({
        organization_project_id: [projectId]
    });

    const reqsList = useMemo(() => {
        return data?.requirements?.reduce((acc, current) => {
            if(current.cv_list_ids) {
                current.cv_list_ids.forEach((cvId) => {
                    if(!acc.includes(parseInt(cvId, 10))) {
                        acc.push(parseInt(cvId, 10));
                    }
                });
            }

            return acc;
        }, [] as Array<number>);
    }, [JSON.stringify(data)]);

    const reqsCvList = useMemo(() => (
        data?.requirements?.reduce((acc, current) => {
            if(current.cv_list) {
                current.cv_list.forEach((cvItem) => {
                    if(!acc.find((findItem) => findItem.id === cvItem.cv_id)) {
                        acc.push({
                            ...cvItem.cv,
                            request_requirement_id         : cvItem.request_requirement_id,
                            organization_project_card_items: cvItem.organization_project_card_items
                        });
                    }
                });
            }

            return acc;
        }, [] as Array<RequestRequirementCvRead>)
    ), [JSON.stringify(data)]);

    const { data: cvListData, isLoading: cvListLoading, refetch: cvListRefetch } = cv.useGetCvListQuery({
        id: reqsList
    }, {
        skip: !reqsList?.length && !reqsCvList?.length
    });

    const [post] = mainRequest.usePostRequestRequirementCvSetDetailsMutation();
    const [unLinkCard] = mainRequest.useDeleteMainRequestCvUnlinkByIdMutation();
    const [cvList, setCvList] = useState<Array<TCvList>>([]);
    const [cards, setCards] = useState<TCardMap>({});
    const [visibleModal, setVisibleModal] = useState<number | null>(null);
    const [ratingCvItem, setRatingCvItem] = useState<TCvList | null>(null);
    const [activeStar, setActiveStar] = useState<number>(0);
    const [hoveredStar, setHoveredStar] = useState<number>(0);

    useEffect(() => {
        if(cvListData) {
            const results = cvListData.results.map((result) => ({
                ...reqsCvList?.find((reqResult) => (reqResult.id === result.id) && reqResult),
                ...result
            }));

            setCvList(results);
        }
    }, [JSON.stringify(cvListData)]);

    useEffect(() => {
        if(projectCardData) {
            setCards(getMapFromTree(projectCardData));
        }
    }, [JSON.stringify(projectCardData)]);

    const onSetRating = (cvItemForRating?: TCvList) => () => {
        if(cvItemForRating) {
            setRatingCvItem(cvItemForRating);
        }
    };

    const onClickStar = (rating: number, cvItemRating: TCvList) => () => {
        setActiveStar(rating);

        methods.setValue('rating', rating);
        methods.setValue('cv_id', cvItemRating.id);
        methods.setValue('id', cvItemRating.request_requirement_id);
    };

    const setUserRating = (formValues: Record<string, number>) => {
        post({
            id    : String(formValues.id),
            cv_id : String(formValues.cv_id),
            rating: formValues.rating
        })
            .unwrap()
            .then(() => {
                setRatingCvItem(null);
                setActiveStar(0);
                methods.reset();
                cvListRefetch();
            })
            .catch(console.error);
    };

    const applyCardForm = (formValues: Record<string, string | boolean>) => {
        const { cv_id, requestRequirementId, ...values } = formValues;
        const falsyRootIds = Object.keys(values)
            .filter((item) => !values[item])
            .filter((item) => !item.includes('card-date-'))
            .map((item) => item.slice('card-'.length))
            .filter((item) => cards[item].parent_id === null);
        const falsyIds = getTreeIds(falsyRootIds, cards);
        const cardIds = Object.keys(values)
            .filter((item) => values[item])
            .filter((item) => !item.includes('card-date-'))
            .map((item) => item.slice('card-'.length))
            .filter((id) => !falsyIds.includes(id));

        let request;

        if(cardIds.length === 0) {
            request = unLinkCard({
                id   : String(requestRequirementId),
                cv_id: String(cv_id)
            });
        } else {
            request = post({
                id                             : String(requestRequirementId),
                cv_id                          : String(cv_id),
                organization_project_card_items: cardIds.map((id) => {
                    const result: { id: number, date?: string } = {
                        id: parseInt(id, 10)
                    };

                    if(values[`card-date-${id}`]) {
                        result.date = String(values[`card-date-${id}`]);
                    }

                    return result;
                })
            });
        }

        request.unwrap()
            .then(() => {
                setVisibleModal(null);
                methods.reset();
            })
            .catch(console.error);
    };

    const elAdditionalBlock = (cvItem?: TCvList) => {
        const careerItem = cvItem?.career?.[0];

        if(cvItem && careerItem) {
            const dateFrom = careerItem.date_from ? new Date(careerItem.date_from) : new Date();
            const dateTo = careerItem.date_to ? new Date(careerItem.date_to) : new Date();
            const experience = differenceInCalendarYears(dateTo, dateFrom);

            return (
                <div className={cn('candidates__user-info-block')}>
                    <div className={cn('candidates__user-info-exp')}>
                        <div className={cn('candidates__user-info-exp-years')}>
                            {t('routes.candidates.main.experience', {
                                count: experience
                            })}
                        </div>
                        <StarRating rating={cvItem.rating || 0} onClick={onSetRating(cvItem)} />
                    </div>
                </div>
            );
        }
    };

    const elCompetencies = (competencies?: Array<CvPositionCompetenceRead>) => {
        if(competencies?.length) {
            return (
                <div className={cn('candidates__competencies')}>
                    {competencies.map((comp) => (
                        <div key={comp.competence_id} className={cn('candidates__competence')}>
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
            title = t('routes.candidates.main.first-name');
        }

        if(Object.keys(cards).length > 0 && cvItem?.organization_project_card_items) {
            rootCard = cvItem
                .organization_project_card_items
                .map(({ id }) => getRootNode(cards, id))
                .reduce((result: TUniqRootCard, item: OrganizationProjectCardItemReadTree) => {
                    if(!item?.id) {
                        return result;
                    }

                    if(result[item.id]) {
                        result[item.id].count += 1;
                    } else {
                        result[item.id] = {
                            ...item,
                            count: 0
                        };
                    }

                    return result;
                }, {});
        }

        const setForm = () => {
            if(!cvItem.organization_project_card_items) {
                return;
            }

            cvItem
                .organization_project_card_items
                .forEach(({ id, date }: { id: number, date?: string }) => {
                    methods.setValue(`card-date-${id}`, date);
                    methods.setValue(`card-${id}`, true);
                });

            methods.setValue('cv_id', cvItem.id);
            methods.setValue('requestRequirementId', (hash === '#all') ? cvItem.request_requirement_id : hash.slice(1));
        };

        return (
            <div key={cvItem.id} className={cn('candidates__user')}>
                <div className={cn('candidates__user-info')}>
                    <UserAvatar
                        className={cn('candidates__user-info-avatar')}
                        title={title}
                        subTitle={subTitle}
                        titleTo={SPECIALIST_ID(cvItem.id)}
                        avatar={{
                            src: cvItem.photo
                        }}
                    />
                    {elAdditionalBlock(cvItem)}
                </div>
                <div className={cn('candidates__user-competencies')}>
                    <p className={cn('candidates__block-title')}>
                        {t('routes.candidates.main.competencies')}
                    </p>
                    {elCompetencies(cvItem.positions?.[0]?.competencies)}
                </div>
                <div className={cn('candidates__column')}>
                    <div className={cn('candidates__user-rate')}>
                        <p className={cn('candidates__block-title')}>
                            {t('routes.candidates.main.rate')}
                        </p>
                        {cvItem.price || '\u2014'}
                    </div>
                    {!!cvItem?.organization_project_card_items && (
                        <div className={cn('candidates__user-cards')}>
                            <p className={cn('candidates__block-title')}>
                                {t('routes.candidates.main.cards')}
                            </p>
                            {Object.keys(rootCard).map((id: string) => {
                                const item: ICard = rootCard[id];

                                if(!item.id) {
                                    return null;
                                }

                                return (
                                    <span
                                        key={item.id}
                                        className={cn('candidates__user-card')}
                                        onClick={() => {
                                            if(item.id) {
                                                setForm();
                                                setVisibleModal(item.id);
                                            }
                                        }}
                                    >
                                        {item.name}
                                        <span className={cn('candidates__user-card-count')}>
                                            ({item.count}/{cards[item.id].cardCount})
                                        </span>
                                    </span>
                                );
                            })}

                            <span
                                className={cn('candidates__link')}
                                onClick={() => {
                                    setForm();
                                    setVisibleModal(ALL_CARD_MODAL_ID);
                                }}
                            >
                                {t('routes.candidates.main.cards-add')}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const elUsers = () => {
        if(isLoading || cvListLoading) {
            return <Loader />;
        }

        if(data?.requirements?.length) {
            const hashValue = hash.slice(1);
            const cvListFiltered = cvList.filter((item) => item.requests_requirements?.find((req) => String(req.id) === hashValue));
            const dataToRender = hashValue === 'all' ? cvList : cvListFiltered;

            if(dataToRender?.length) {
                return (
                    <div className={cn('candidates__users')}>
                        {dataToRender.map((cvItem) => elUserItem(cvItem))}
                    </div>
                );
            }

            return <span className={cn('candidates__users-empty')}>{t('routes.candidates.main.users.empty')}</span>;
        }

        return <span className={cn('candidates__users-empty')}>{t('routes.candidates.main.users.empty')}</span>;
    };

    const renderTree = (cardList: TCardList, level?: number) => {
        const currentLevel = level || 0;

        return cardList.map((item) => (
            <CardWrapper key={item.id} level={level}>
                <React.Fragment>
                    {level === undefined && (
                        <React.Fragment>
                            <div className={cn('candidates__modal-content-title')}>{item.name}</div>
                            <div className={cn('candidates__modal-content-title')}>
                                {t('routes.candidates.modal-card.date')}
                            </div>
                        </React.Fragment>
                    )}
                    {item.children.length > 0 && (
                        renderTree(item.children, currentLevel + 1)
                    )}
                    {level !== undefined && (
                        <React.Fragment>
                            <Checkbox
                                name={`card-${item.id}`}
                                label={item.name}
                                className={{
                                    'checkbox__label': cn('candidates__modal-card-checkbox')
                                }}
                            />
                            <div className={cn('candidates__modal-content-date')}>
                                <InputDate name={`card-date-${item.id}`} />
                            </div>
                        </React.Fragment>
                    )}
                </React.Fragment>
            </CardWrapper>
        ));
    };

    const renderCard = projectCardData?.filter((item) => item.id === visibleModal) || [];

    const elCardsModal = () => {
        if(visibleModal !== null) {
            return (
                <Modal
                    header={
                        t('routes.candidates.modal-card.title', {
                            name   : renderCard.length === 1 ? renderCard[0].name : '',
                            context: renderCard.length === 1 ? 'current' : 'add'
                        })
                    }
                    footer={
                        <ModalFooterSubmit>
                            <Button isSecondary={true} onClick={() => setVisibleModal(null)}>
                                {t('routes.candidates.modal-card.cancel')}
                            </Button>
                            <Button form={APPLY_CARD_FORM_ID} type="submit">
                                {t('routes.candidates.modal-card.submit')}
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
                            {renderCard.length === 0 && projectCardData?.map((item) => (
                                <Checkbox
                                    key={item.id}
                                    name={`card-${item.id}`}
                                    label={item.name}
                                    className={{
                                        'checkbox__label': cn('candidates__modal-card-checkbox')
                                    }}
                                />
                            ))}
                        </form>
                    </FormProvider>
                </Modal>
            );
        }
    };

    const elRatingModal = () => {
        if(ratingCvItem) {
            const ratingArr = [1, 2, 3, 4, 5];

            return (
                <Modal
                    header={t('routes.candidates.modal-rating.title')}
                    footer={
                        <ModalFooterSubmit>
                            <Button isSecondary={true} onClick={() => setRatingCvItem(null)}>
                                {t('routes.candidates.modal-rating.cancel')}
                            </Button>
                            <Button form={RATING_FORM_ID} type="submit">
                                {t('routes.candidates.modal-rating.submit')}
                            </Button>
                        </ModalFooterSubmit>
                    }
                    onClose={() => setRatingCvItem(null)}
                >
                    <FormProvider {...methods}>
                        <form
                            method="POST"
                            onSubmit={methods.handleSubmit(setUserRating)}
                            id={RATING_FORM_ID}
                            className={cn('candidates__star-form')}
                        >
                            {ratingArr.map((item) => (
                                <IconStar
                                    key={item}
                                    svg={{
                                        className: cn('candidates__star', {
                                            'candidates__star_active': activeStar >= item || hoveredStar >= item
                                        }),
                                        onClick     : onClickStar(item, ratingCvItem),
                                        onMouseOver : () => setHoveredStar(item),
                                        onMouseLeave: () => setHoveredStar(0)
                                    }}
                                />
                            ))}
                        </form>
                    </FormProvider>
                </Modal>
            );
        }
    };

    return (
        <section className={cn('candidates')}>
            <h2 className={cn('candidates__header')}>{t('routes.candidates.main.title')}</h2>
            {elUsers()}
            {elCardsModal()}
            {elRatingModal()}
        </section>
    );
};

export default Candidates;
