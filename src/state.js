import {Subject} from 'rxjs';
import without from 'lodash/without';
// import updateWith from 'lodash/updateWith';
import set from 'lodash/set';
// import get from 'lodash/get';
import mergeWith from 'lodash/mergeWith';
import isArray from 'lodash/isArray';
import unionWith from 'lodash/unionWith';
import isEqual from 'lodash/isEqual';

const translationsSubject = new Subject();
const similarSubject = new Subject();
const suggestionsSubject = new Subject();
const detectedLanguageSubject = new Subject();

// const traverse = (obj, path, fallback, customizer) => {
//   updateWith(obj, path, (n = fallback) => n, customizer);
//   return get(obj, path);
// };

export const translations = () => {
  const index = {};
  const subject = new Subject();
  translationsSubject.asObservable().subscribe(({terms, source}) => {
    const langs = Object.keys(terms);
    langs.forEach(from => {
      without(langs, from).forEach(to => {
        const toMerge = set(
          {},
          [from, terms[from]],
          [
            {
              text: terms[to],
              lang: to,
              sources: [source],
            },
          ],
        );
        mergeWith(index, toMerge, (a, b) =>
          isArray(a) ? unionWith(a, b, isEqual) : undefined,
        );
      });
    });
    subject.next(index);
  });
  return subject.asObservable();
};

export const translationsIndex = translations();

// const similarByTerm = ({lang}) => {
//   const index = new Map();
//   const subject = new Subject();
//   similarSubject
//     .asObservable()
//     .subscribe(({original, similar, lang: similarLang, source}) => {
//       if (similarLang === lang) {
//         const newSimilar = {
//           text: similar,
//           sources: [source],
//         };
//         if (!index.has(original)) {
//           index.set(original, [newSimilar]);
//         } else {
//           const simil = index.get(original).find(list => list.text === similar);
//           if (simil) {
//             simil.sources.push(source);
//           } else {
//             index.get(original).push(newSimilar);
//           }
//         }
//       }
//       subject.next(index);
//     });
//   return subject.asObservable();
// };

// const suggestionsByTerm = ({lang}) => {
//   const index = new Map();
//   const subject = new Subject();
//   suggestionsSubject
//     .asObservable()
//     .subscribe(({original, suggestion, lang: similarLang, source}) => {
//       if (similarLang === lang) {
//         const newSuggestion = {
//           text: suggestion,
//           sources: [source],
//         };
//         if (!index.has(original)) {
//           index.set(original, [newSuggestion]);
//         } else {
//           const simil = index
//             .get(original)
//             .find(list => list.text === suggestion);
//           if (simil) {
//             simil.sources.push(source);
//           } else {
//             index.get(original).push(newSuggestion);
//           }
//         }
//       }
//       subject.next(index);
//     });
//   return subject.asObservable();
// };

// export const translationsDeu = translationsByTerm({
//   from: 'deu',
//   langs: ['eng', 'esp'],
// });
// export const similarDeu = similarByTerm({lang: 'deu'});
// export const suggestionsDeu = suggestionsByTerm({lang: 'deu'});

export const addTranslation = ({terms, source}) => {
  translationsSubject.next({terms, source});
};

export const addSimilar = ({original, similar, lang, source}) => {
  similarSubject.next({original, similar, lang, source});
};

export const addSuggestion = ({original, suggestion, lang, source}) => {
  suggestionsSubject.next({original, suggestion, lang, source});
};

export const languageDetected = detectedLanguageSubject.asObservable();

export const detectLanguage = lang => {
  detectedLanguageSubject.next(lang);
};
