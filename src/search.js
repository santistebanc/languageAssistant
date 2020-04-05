import {reverso} from './fetchSources/reverso';

import {
  getAllTranslations,
  getAllPhraseExamples,
  getAllSuggestionTerms,
  getAllSimilarTerms,
  requestSearch,
} from './actions';
import without from 'lodash/without';
import {observable, action} from 'mobx';
import 'models2';

const LANGUAGES = ['en', 'de', 'es'];

const Search = observable(
  {
    detectedLang: '',
    searchTerm: '',

    get translations() {
      return getAllTranslations({
        lang: this.detectedLang,
        text: this.searchTerm,
      });
    },

    get suggestions() {
      return getAllSuggestionTerms({
        lang: this.detectedLang,
        text: this.searchTerm,
      });
    },

    get similarTerms() {
      return getAllSimilarTerms({
        lang: this.detectedLang,
        text: this.searchTerm,
      });
    },

    get examplePhrases() {
      return getAllPhraseExamples({
        lang: this.detectedLang,
        text: this.searchTerm,
      });
    },

    async search(text) {
      this.searchTerm = text;
      // await requestSearch(text);
      // const langs = without(LANGUAGES, from);
      // langs.forEach(to => {
      //   googleTranslate(text, from, to);
      //   reverso(text, from, to);
      // });
    },
  },
  {
    search: action,
  },
);

export default Search;
