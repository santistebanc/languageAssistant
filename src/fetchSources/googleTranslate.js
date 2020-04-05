import {Platform} from 'react-native';
import translate from './utils/translate';
import {Fetch} from '../models2';

const CORSService = Platform.OS === 'web' && 'https://cors.x7.workers.dev/';
const source = {name: 'googleTranslate', action: 'searchFetch'};

export default async ({text, from = 'auto', to = 'en'}) => {
  const params = {text, from, to};
  const fetchFields = {
    name: 'googleTranslate',
    params: JSON.stringify(params),
  };
  const cached = Fetch.get(fetchFields);
  if (cached) {
    return cached;
  } else {
    try {
      const res = await translate(text, {from, to}, CORSService);
      const detectedLang = res.from.language.iso || from;
      const response = {text, from: detectedLang, to, source};
      if (detectedLang !== to) {
        if (res.from.text.value) {
          const correct = res.from.text.value.replace('[', '').replace(']', '');
          response.correction = correct;
        }
        response.translation = res.text;
      }
      return Fetch.create({...fetchFields, data: response});
    } catch (err) {
      console.log(err);
    }
  }
};
