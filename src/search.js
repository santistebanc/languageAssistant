import {
  googleTranslate,
  gtDetectLanguage,
} from './fetchSources/googleTranslate';
import {reverso} from './fetchSources/reverso';
import {Translations, Suggestions, SimilarTerms} from './store';
import without from 'lodash/without';
import {observable, action} from 'mobx';

const LANGUAGES = ['en', 'de', 'es'];

const Search = observable(
  {
    detectedLang: '',
    searchTerm: '',

    get translations() {
      return Translations.byText(this.detectedLang, this.searchTerm);
    },

    get suggestions() {
      return Suggestions.byText(this.detectedLang, this.searchTerm);
    },

    get similarTerms() {
      return SimilarTerms.byText(this.detectedLang, this.searchTerm);
    },

    async search(text) {
      this.searchTerm = text;
      const from = await gtDetectLanguage(text);
      this.detectedLang = from;
      const langs = without(LANGUAGES, from);
      langs.forEach(to => {
        googleTranslate(text, from, to);
        reverso(text, from, to);
      });
    },
  },
  {
    search: action,
  },
);

export default Search;
