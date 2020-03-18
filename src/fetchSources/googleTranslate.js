import {Platform} from 'react-native';
import translate from './utils/translate';
import {Index} from '../utils';
import {transaction} from 'mobx';
import {addTranslationPair, addSuggestion} from '../store';

const CORSService = Platform.OS === 'web' && 'https://cors.x7.workers.dev/';

const cacheTrans = new Index();
const cacheLang = new Map();

const addTranslation = ({res, text, from, to}) => {
  transaction(async () => {
    const source = {name: 'googleTranslate', action: 'searchFetch'};
    if (from !== to) {
      if (res.from.text.value) {
        const correct = res.from.text.value.replace('[', '').replace(']', '');
        addSuggestion({
          original: text,
          suggestion: correct,
          lang: from,
          source,
        });
      }
      addTranslationPair({
        from,
        to,
        original: text,
        translated: res.text,
        source,
      });
      cacheTrans.set([text, from, to], Date.now());
    }
  });
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
