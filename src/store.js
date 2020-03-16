import {observable, transaction} from 'mobx';
import {toObject, Index} from './utils';
import {computedFn} from 'mobx-utils';

const Term = ({text, lang}) =>
  observable({
    text,
    lang,
    get sources() {
      return Sources.getByTarget(this);
    },
  });

const Phrase = ({text, lang}) =>
  observable({
    text,
    lang,
    get sources() {
      return Sources.getByTarget(this);
    },
  });

export const Terms = observable({
  index: new Index(),
  add({text, lang, source}) {
    const newItem = this.index.set([lang, text], Term({text, lang}));
    Sources.add({name: source, target: newItem});
    return newItem;
  },
});

export const Sources = observable({
  index: new Index(),
  add({name, target}) {
    return this.index.add([target], name);
  },
  getByTarget: computedFn(function(target) {
    return this.index.get([target]);
  }),
});

export const Translations = observable({
  index: new Index(),
  add({terms, source}) {
    transaction(() => {
      Object.entries(terms).forEach(([lang1, text1]) => {
        Object.entries(terms).forEach(([lang2, text2]) => {
          const term1 = Terms.add({text: text1, lang: lang1, source});
          const term2 = Terms.add({text: text2, lang: lang2, source});
          const trans = this.index.add([term1], term2);
          Sources.add({name: source, target: trans});
        });
      });
    });
  },
  byText: computedFn(function(lang, text) {
    const term = Terms.index.get([lang, text]);
    const list = [];
    if (term) {
      Array.from(this.index.get([term])).forEach(tr => {
        if (tr.lang !== lang) {
          list.push(tr);
        }
      });
    }
    return list;
  }),
  print() {
    return toObject(this.index.get(), ([term, trans]) => [
      term.text,
      Array.from(trans).map(tr => tr.text),
    ]);
  },
});

export const Suggestions = observable({
  index: new Index(),
  add({original, suggestion, from, source}) {
    return this.index.add([from, original, suggestion], source);
  },
  byText: computedFn(function(lang, text) {
    if (!this.index.has([lang, text])) {
      return [];
    }
    return Array.from(
      this.index.get([lang, text]).entries(),
    ).map(([suggestion, sources]) => ({text: suggestion, sources}));
  }),
});

export const SimilarTerms = observable({
  index: new Index(),
  add({original, similar, from, source}) {
    return this.index.add([from, original, similar], source);
  },
  byText: computedFn(function(lang, text) {
    if (!this.index.has([lang, text])) {
      return [];
    }
    return Array.from(
      this.index.get([lang, text]).entries(),
    ).map(([similar, sources]) => ({text: similar, sources}));
  }),
});

export const Phrases = observable({
  index: new Index(),
  add({text, lang, source}) {
    const phrase = this.index.set([text, lang], Phrase({text, lang, source}));
    Sources.add({name: source, target: phrase});
    return phrase;
  },
});

export const ExamplePhrases = observable({
  index: new Index(),
  add({termText, phraseText, lang, source}) {
    const term = Terms.add({text: termText, lang});
    const phrase = Phrases.add({text: phraseText, lang, source});
    this.index.add([term], phrase);
  },
  byText: computedFn(function(lang, text) {
    const term = Terms.index.get([lang, text]);
    if (term) {
      console.log(
        '////////////',
        lang,
        text,
        term,
        this.index.get([term]),
        Array.from(this.index.get([term], new Set())),
      );
      return Array.from(this.index.get([term], new Set()));
    }
    return [];
  }),
});

export const PhraseTranslations = observable({
  index: new Index(),
  add({phrases, source}) {
    transaction(() => {
      Object.entries(phrases).forEach(([lang1, text1]) => {
        Object.entries(phrases).forEach(([lang2, text2]) => {
          const phrase1 = Phrases.add({text: phrase1, lang: lang1, source});
          const phrase2 = Phrases.add({text: phrase2, lang: lang2, source});
          const trans = this.index.add([phrase1], phrase2);
          Sources.add({name: source, target: trans});
        });
      });
    });
  },
  byText: computedFn(function(lang, text) {
    const phrase = Phrases.index.get([lang, text]);
    const list = [];
    if (phrase) {
      Array.from(this.index.get([phrase])).forEach(tr => {
        if (tr.lang !== lang) {
          list.push(tr);
        }
      });
    }
    return list;
  }),
  print() {
    return toObject(this.index.get(), ([phrase, trans]) => [
      phrase.text,
      Array.from(trans).map(tr => tr.text),
    ]);
  },
});
