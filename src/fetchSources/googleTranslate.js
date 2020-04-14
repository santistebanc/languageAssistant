import { Platform } from "react-native";
import translate from "./utils/translate";
import { fetchCall } from "../actions";
import { runInAction } from "mobx";
import { addTranslationPair } from "../actions";
import sanitize from "./utils/sanitize";

const CORSService = Platform.OS === "web" ? "https://cors.x7.workers.dev/" : "";

export default (search, { text, from = "auto", to = "en" }) =>
  fetchCall("googleTranslate", { text, from, to }, async () => {
    const res = await translate(text, { from, to }, CORSService);
    const detectedLang = res.from.language.iso || from;
    runInAction(() => {
      search.set.detectedLang({ lang: detectedLang });
      if (detectedLang !== to) {
        let correctText = text;
        if (res.from.text.value) {
          correctText = res.from.text.value.replace("[", "").replace("]", "");
          search.add.corrections({
            correction: sanitize(correctText),
            lang: detectedLang
          });
        }
        const { fromTerm } = addTranslationPair({
          from: detectedLang,
          to,
          original: sanitize(correctText),
          translated: sanitize(res.text)
        });
        search.add.results(fromTerm);
      }
    });
  });
