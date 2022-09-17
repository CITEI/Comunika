import { I18n } from 'i18n-js';
import Localization from 'expo-localization';
import en from './translations/en.json';
import pt from './translations/pt.json';


const i18n = new I18n({
  en, pt
}, {
  defaultLocale: 'en',
  locale: Localization.locale,
  enableFallback: true,
})

export default (txt: string) => i18n.t(txt);
