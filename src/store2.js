import {observable, transaction} from 'mobx';
import {toObject, Index} from './utils2';
import {computedFn} from 'mobx-utils';

const Term = ({text, lang}) =>
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
