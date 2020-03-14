import {Subject} from 'rxjs';

class Index {
  store = new Map();
  subject = new Subject();
  index(path = [], value) {
    return path.reduce((current, next, i) => {
      if (!current.has(next)) {
        const payload = i === path.length - 1 ? value : new Map();
        current.set(next, payload);
        this.subject.next({type: 'add', payload, index: this.store});
        if (i === path.length - 1 && typeof value === 'undefined') {
          return next;
        }
      }
      return current.get(next);
    }, this.store);
  }
  get(path = []) {
    let current = this.store;
    for (const next of path) {
      if (!current.has(next)) {
        return;
      }
      current = current.get(next);
    }
    return current;
  }
  print(path = []) {
    const toObject = (map = new Map()) =>
      Object.fromEntries(
        Array.from(map.entries(), ([k, v]) => {
          const val = v instanceof Map ? toObject(v) : v;
          const key =
            k instanceof Map
              ? toObject(k)
              : typeof k === 'object'
              ? JSON.stringify(k)
              : k;
          return [key, val];
        }),
      );
    return toObject(this.get(path));
  }
  observable() {
    return this.subject.asObservable();
  }
}

const toObject = (map = new Map(), func) =>
  Object.fromEntries(
    Array.from(
      map.entries(),
      func ||
        (([k, v]) => {
          const val = v instanceof Map ? toObject(v) : v;
          const key =
            k instanceof Map
              ? toObject(k)
              : typeof k === 'object'
              ? JSON.stringify(k)
              : k;
          return [key, val];
        }),
    ),
  );

const Term = ({text, lang}) => ({
  text,
  lang,
  class: 'term',
});

// const Trans = ({terms}) => {
//     const
//   const term = termsIndex.get(Object.entries(terms)[0]);
//   const trans = term && [...translationsIndex.get([term]).keys()].find(tr=>tr.terms)
//   return (
//     (term && translationsIndex.get([term, ])) || {
//       terms,
//       class: 'translation',
//     }
//   );
// };

const translationsIndex = new Index();
const termsIndex = new Index();
const sourcesIndex = new Index();

export const addTranslation = ({terms, source}) => {
  Object.entries(terms).forEach(([lang1, text1]) => {
    Object.entries(terms).forEach(([lang2, text2]) => {
      const term1 = termsIndex.index(
        [lang1, text1],
        Term({text: text1, lang: lang1}),
      );
      const term2 = termsIndex.index(
        [lang2, text2],
        Term({text: text2, lang: lang2}),
      );
      const trans = translationsIndex.index([term1, term2]);
      sourcesIndex.index([source, 'terms', term1]);
      sourcesIndex.index([source, 'terms', term2]);
      sourcesIndex.index([source, 'translations', trans]);
    });
  });
};

//getters

export const printTermsIndex = () =>
  Object.fromEntries(
    Array.from(termsIndex.get().entries(), ([k, v]) => [k, [...v.keys()]]),
  );

export const printTranslationsIndex = () => {
  return toObject(translationsIndex.get(), ([term, trans]) => [
    term.text,
    [...trans.keys()].map(tr => tr.text),
  ]);
};

// const getTermByText = (lang, text) => termsIndex.get([lang, text]);

export const translationsByText = {
  get: (lang, text) => {
    const term = termsIndex.get([lang, text]);
    return (
      term &&
      [...translationsIndex.get([term]).keys()].reduce(
        (list, tr) =>
          tr.lang !== lang
            ? [
                ...list,
                {
                  text: tr.text,
                  lang: tr.lang,
                },
              ]
            : list,
        [],
      )
    );
  },
  observable: () => translationsIndex.observable(),
};

// const getTermsBySource = source => {
//   return [...sourcesIndex.get([source, 'terms']).keys()];
// };

// const getTranslationsBySource = source => {
//   return [...sourcesIndex.get([source, 'translations']).keys()];
// };

// addTranslation({terms: {en: 'boy', de: 'Junge'}, source: 'manual'});
// addTranslation({terms: {en: 'hi', de: 'Hallo'}, source: 'manual'});
// addTranslation({terms: {en: 'hello', de: 'Hallo'}, source: 'manual'});
// addTranslation({terms: {en: 'red', de: 'rot'}, source: 'manual2'});
// addTranslation({terms: {en: 'car', de: 'Auto'}, source: 'manual'});
// addTranslation({terms: {en: 'car', de: 'Auto'}, source: 'manual'});

// // console.log(printTranslationsIndex());
// console.log('.......\n', getTranslationsBySource('manual'));
// console.log('.......\n', getTranslationsByText('de', 'Hallo'));
