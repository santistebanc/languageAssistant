import {observable, transaction} from 'mobx';
import {toObject, Index} from './utils';
import {computedFn} from 'mobx-utils';

export const Terms = observable({
  index: new Index(),
  add({text, lang, source}) {
    const newItem = this.index.index([lang, text], {text, lang});
    Sources.add({type: 'terms', source, target: newItem});
    return newItem;
  },
});

export const Sources = observable({
  index: new Index(),
  add({type, name, target}) {
    return this.index.index([name, type, target]);
  },
});

export const Translations = observable({
  index: new Index(),
  add({terms, source}) {
    transaction(() => {
      Object.entries(terms).forEach(([lang1, text1]) => {
        Object.entries(terms).forEach(([lang2, text2]) => {
          const term1 = Terms.add({text: text1, lang: lang1, source});
          const term2 = Terms.add({text: text2, lang: lang2, source});
          const trans = this.index.index([term1, term2]);
          Sources.add({type: 'translations', name: source, target: trans});
        });
      });
    });
  },
  byText: computedFn(function(lang, text) {
    const term = Terms.index.get([lang, text]);
    return term
      ? [...this.index.get([term]).keys()].reduce(
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
      : [];
  }),
  print() {
    return toObject(this.index.get(), ([term, trans]) => [
      term.text,
      [...trans.keys()].map(tr => tr.text),
    ]);
  },
});
