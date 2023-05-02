import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import pt from './translations/pt.json';
import en from './translations/en.json'

const i18n = new I18n({
  pt, en
}, {
  defaultLocale: 'en',
  locale: Localization.locale,
  enableFallback: true,
  missingBehavior: 'guess',
})

const t = (txt: string) => i18n.t(txt);
export default t;
