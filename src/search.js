import { Search } from "./models";
import fetchGoogleTranslate from "./fetchSources/googleTranslate";
import fetchReverso from "./fetchSources/reverso";
import { observable, reaction } from "mobx";

const LANGUAGES = ["en", "de", "es"];

class SearchSession {
  @observable query = "";
  get detectedLang() {
    return (
      this.query && Search.get({ text: this.query }, {}).detectedLang?.lang
    );
  }
  get results() {
    return (this.query && Search.get({ text: this.query }, {}).results) || [];
  }
  detectLanguage = reaction(
    () => this.query,
    (text) => {
      const search = Search.create({ text });
      if (!search.detectedLang) {
        fetchGoogleTranslate(search, {
          text,
          to: LANGUAGES[0],
        });
      }
    }
  );
  searchQuery = reaction(
    () => ({ from: this.detectedLang, text: this.query }),
    ({ text, from }) => {
      const search = Search.create({ text });
      if (from) {
        LANGUAGES.forEach((to) => {
          if (to !== from) {
            fetchGoogleTranslate(search, {
              text,
              from,
              to,
            });
            // fetchReverso(search, { text, from, to });
          }
        });
      }
    }
  );
}

export default new SearchSession();
