import {Platform} from 'react-native';
import translate from './utils/translate';
import {Translations} from '../store2';

const CORSService = Platform.OS === 'web' && 'https://cors.x7.workers.dev/';

export const googleTranslate = async (text, from, to) => {
  return translate(text, {from, to}, CORSService)
    .then(res => {
      if (from !== to) {
        if (res.from.text.value) {
          //   const correct = res.from.text.value.replace('[', '').replace(']', '');
          //   addSuggestion({
          //     original: text,
          //     suggestion: correct,
          //     lang: to,
          //     source: 'googleTranslate',
          //   });
        }
        Translations.add({
          terms: {[from]: text, [to]: res.text},
          source: 'googleTranslate',
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
};

export const gtDetectLanguage = async text => {
  return translate(text, {from: 'auto', to: 'en'}, CORSService)
    .then(res => res.from.language.iso)
    .catch(err => {
      console.error(err);
    });
};
