import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import en from './en/common.json'
import ko from './ko/common.json'
import es from './es/common.json'
import fa from './fa/common.json'
import hu from './hu/common.json'
import ro from './ro/common.json'
import vi from './vi/common.json'
import zh from './zh/common.json'

const resource = {
    en : {
        translation:en
    },
    ko : {
        translation:ko,
    },
    es : {
        translation:es,
    },
    fa : {
        translation:fa,
    },
    hu : {
        translation:hu,
    },
    ro : {
        translation:ro,
    },
    vi : {
        translation:vi,
    },
    zh : {
        translation:zh,
    },
}
i18n.use(initReactI18next).init({
    resources:resource,
    lng:'ko',
    fallbackLng:'ko',
    debug:true,
    keySeparator:false,
    interpolation:{escapeValue:false}
});

export default i18n