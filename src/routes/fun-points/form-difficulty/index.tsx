import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'component/modal';
import ModalFooterSubmit from 'component/modal/footer-submit';
import Button from 'component/button';
import Error from 'component/error';

import { mainRequest } from 'adapter/api/main';
import Input from 'component/form/input';
import { FormProvider, useForm } from 'react-hook-form';

interface IEditModal {
    setVisible: (visible: boolean) => void,
    funPointName?: string,
    funPointId: string,
    onClickCancel?(): void,
    onSuccess?(): void
}

const FormDifficulty = ({ setVisible, funPointId, funPointName, onClickCancel, onSuccess }: IEditModal) => {
    const { t } = useTranslation();

    const [error, setError] = useState<string | null>(null);

    const form = useForm();

    const [post] = mainRequest.usePostMain();

    const onClickDelete = () => {
        setError(null);

        deleteModuleFunPoint({ id: String(funPointId) })
            .unwrap()
            .then(() => {
                setVisible(false);

                onSuccess?.();
            })
            .catch((err) => {
                setError(err?.message);
                console.error(err);
            });
    };

    const elError = useMemo(() => {
        if(error) {
            return <Error elIcon={true}>{error}</Error>;
        }
    }, [error]);

    return (
        <FormProvider {...form}>
            <form
                method="POST"
                id={FORM_DIFFICULTY_LEVEL}
                onSubmit={onSubmitDiff}
                className={cn('fun-point__form')}
            >
                <Input name="123" type="text" />
                {elError}
            </form>
        </FormProvider>
    );
};

export default ConfirmModalDeleteFunPoint;
