import {Platform} from 'react-native';
import translate from './utils/translate';
import {Translations, Suggestions} from '../store';
import {Index} from '../utils';

const CORSService = Platform.OS === 'web' && 'https://cors.x7.workers.dev/';

const cacheTrans = new Index();
const cacheLang = new Map();

const addTranslation = ({res, text, from, to}) => {
  if (from !== to) {
    if (res.from.text.value) {
      const correct = res.from.text.value.replace('[', '').replace(']', '');
      Suggestions.add({
        original: text,
        suggestion: correct,
        from,
        source: 'googleTranslate',
      });
    }
    Translations.add({
      terms: {[from]: text, [to]: res.text},
      source: 'googleTranslate',
    });
    cacheTrans.set([text, from, to], Date.now());
  }
};

export const googleTranslate = async (text, from, to) => {
  if (cacheTrans.has([text, from, to])) {
    return;
  }
  try {
    const res = await translate(text, {from, to}, CORSService);
    addTranslation({res, text, from, to});
  } catch (err) {
    console.log(err);
  }
};

export const gtDetectLanguage = async text => {
  if (cacheLang.has(text)) {
    return cacheLang.get(text);
  }
  try {
    const res = await translate(text, {from: 'auto', to: 'en'}, CORSService);
    const detectedLang = res.from.language.iso;
    cacheLang.set(text, detectedLang);
    addTranslation({res, text, from: detectedLang, to: 'en'});
    return detectedLang;
  } catch (err) {
    console.log(err);
  }
};
