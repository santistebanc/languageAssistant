import {
  googleTranslate,
  gtDetectLanguage,
} from './fetchSources/googleTranslate';
import {reverso} from './fetchSources/reverso';
import {Translations} from './store2';
import without from 'lodash/without';
import {observable, action} from 'mobx';

const LANGUAGES = ['en', 'de', 'es'];

const Search = observable(
  {
    // observable properties:
    results: new Set(),
    detectedLang: '',
    searchTerm: '',

    // computed property:
    get translations() {
      return Translations.byText(this.detectedLang, this.searchTerm);
    },

    search(text) {
      this.searchTerm = text;
      if (this.results.has(text)) {
        return;
      } else {
        this.results.add(text);
      }

      gtDetectLanguage(text).then(from => {
        this.detectedLang = from;
        const langs = without(LANGUAGES, from);
        langs.forEach(to => {
          googleTranslate(text, from, to);
          reverso(text, from, to);
        });
      });
    },
  },
  {
    search: action,
  },
);

export default Search;
