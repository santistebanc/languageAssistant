import {Platform} from 'react-native';
import translate, {setCORS} from './fetchSources/googleTranslate';
import {Subject} from 'rxjs';

const subject = new Subject();

const googleTranslate = async (text, to) => {
  const trans =
    Platform.OS === 'web'
      ? setCORS('http://cors-anywhere.herokuapp.com/')
      : translate;

  return trans(text, {to}).catch(err => {
    console.error(err);
  });
};

const searchService = settings => {
  return {
    new: text => startSearch(text, settings),
    observable: subject.asObservable(),
  };
};

const startSearch = (text, settings) => {
  googleTranslate(text, 'en').then(res =>
    subject.next({id: 'gt_detect_eng', status: 'success', payload: res.text}),
  );
  googleTranslate(text, 'es').then(res =>
    subject.next({id: 'gt_detect_esp', status: 'success', payload: res.text}),
  );
};

export default searchService;
