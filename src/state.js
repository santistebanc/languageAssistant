import {Subject} from 'rxjs';

const translationsSubject = new Subject();
const similarSubject = new Subject();
const suggestionsSubject = new Subject();

const translationsByTerm = ({from, langs}) => {
  const index = new Map();
  const subject = new Subject();
  translationsSubject.asObservable().subscribe(({terms, source}) => {
    const fromText = terms[from];
    langs.forEach(lang => {
      const toText = terms[lang];
      if (fromText && toText) {
        const newTranslation = {
          text: toText,
          sources: [source],
          lang,
        };
        if (!index.has(fromText)) {
          index.set(fromText, [newTranslation]);
        } else {
          const trans = index.get(fromText).find(list => list.text === toText);
          if (trans) {
            trans.sources.push(source);
          } else {
            index.get(fromText).push(newTranslation);
          }
        }
      }
      subject.next(index);
    });
  });
  return subject.asObservable();
};

const similarByTerm = ({lang}) => {
  const index = new Map();
  const subject = new Subject();
  similarSubject
    .asObservable()
    .subscribe(({original, similar, lang: similarLang, source}) => {
      if (similarLang === lang) {
        const newSimilar = {
          text: similar,
          sources: [source],
        };
        if (!index.has(original)) {
          index.set(original, [newSimilar]);
        } else {
          const simil = index.get(original).find(list => list.text === similar);
          if (simil) {
            simil.sources.push(source);
          } else {
            index.get(original).push(newSimilar);
          }
        }
      }
      subject.next(index);
    });
  return subject.asObservable();
};

const suggestionsByTerm = ({lang}) => {
  const index = new Map();
  const subject = new Subject();
  suggestionsSubject
    .asObservable()
    .subscribe(({original, suggestion, lang: similarLang, source}) => {
      if (similarLang === lang) {
        const newSuggestion = {
          text: suggestion,
          sources: [source],
        };
        if (!index.has(original)) {
          index.set(original, [newSuggestion]);
        } else {
          const simil = index
            .get(original)
            .find(list => list.text === suggestion);
          if (simil) {
            simil.sources.push(source);
          } else {
            index.get(original).push(newSuggestion);
          }
        }
      }
      subject.next(index);
    });
  return subject.asObservable();
};

export const translationsDeu = translationsByTerm({
  from: 'deu',
  langs: ['eng', 'esp'],
});
export const similarDeu = similarByTerm({lang: 'deu'});
export const suggestionsDeu = suggestionsByTerm({lang: 'deu'});

export const addTranslation = ({terms, source}) => {
  translationsSubject.next({terms, source});
};

export const addSimilar = ({original, similar, lang, source}) => {
  similarSubject.next({original, similar, lang, source});
};

export const addSuggestion = ({original, suggestion, lang, source}) => {
  suggestionsSubject.next({original, suggestion, lang, source});
};
