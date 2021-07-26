import { formatDistance } from 'date-fns';
import localeRu from 'date-fns/locale/ru';
import localeEn from 'date-fns/locale/en-GB';
import { useTranslation } from 'react-i18next';

interface IFormatDistanceWithLocale {
    date: Date | number,
    baseDate: Date | number,
    options?: {
        includeSeconds?: boolean,
        addSuffix?: boolean,
        locale?: Locale
    }
}

const useFormatDistance = () => {
    const { i18n } = useTranslation();
    const locale = i18n.language === 'ru' ? localeRu : localeEn;

    return ({ date, baseDate, options }: IFormatDistanceWithLocale) => (
        formatDistance(date, baseDate, { locale: locale, ...options })
    );
};

export default useFormatDistance;
