import { Platform } from "react-native";
import cheerio from "cheerio-without-node-native";
import { runInAction } from "mobx";
import {
  addTranslationPair,
  addSimilarTerm,
  addExamplePhrasePair,
} from "../actions";
import { fetchCall } from "../actions";
import sanitize from "./utils/sanitize";
import UserAgent from "user-agents";

const CORSService = Platform.OS === "web" ? "https://cors.x7.workers.dev/" : "";
const mappingLang = (lang) =>
  ({ en: "english", de: "german", es: "spanish" }[lang]);

export default (search, { text, from, to }) =>
  fetchCall("reverso", { text, from, to }, async () => {
    const searchUrl =
      CORSService +
      `https://context.reverso.net/translation/${mappingLang(
        from
      )}-${mappingLang(to)}/${text.replace(" ", "+")}`;
    const fetchOptions = {
      headers: {
        "User-Agent": new UserAgent().toString(),
      },
    };
    const response = await fetch(searchUrl, fetchOptions);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const searchQuery = sanitize($("#entry").val());
    runInAction(() => {
      if (searchQuery !== text) {
        search.add.corrections({
          correction: searchQuery,
          lang: from,
        });
      }
      $("#translations-content>a.translation")
        .slice(1)
        .each(function(i, el) {
          const trans = sanitize(
            $(this)
              .text()
              .trim()
          );
          const { toTerm } = addTranslationPair({
            from,
            to,
            original: searchQuery,
            translated: trans,
          });
          const freq = Number(sanitize($(this).attr("data-freq")));
          toTerm.add.frequencyScores({ source: "reverso", freq, weight: 5 });
        });
      $("#seealso-content>a").each(function() {
        const similar = sanitize($(this).text());
        addSimilarTerm({
          original: searchQuery,
          similar,
          lang: from,
        });
      });
      $("#splitting-content>.split.wide-container").each(function() {
        const similar = sanitize(
          $(this)
            .find("a.src")
            .text()
        );
        addSimilarTerm({
          original: searchQuery,
          similar,
          lang: from,
        });
        $(this)
          .find(".trgs>a.translation")
          .each(function() {
            const trans = sanitize($(this).text());
            addTranslationPair({
              from,
              to,
              original: similar,
              translated: trans,
            });
          });
      });
      $("#examples-content>.example").each(function() {
        const phraseOriginal = sanitize(
          $(this)
            .find(".src>.text")
            .text()
            .trim()
        );
        const highlightOriginal = $(this)
          .find(".src>.text em")
          .map(function() {
            return sanitize(
              $(this)
                .text()
                .trim()
            );
          })
          .get();
        const termTextOriginal = highlightOriginal.join(" ... ");
        if (termTextOriginal !== searchQuery) {
          addSimilarTerm({
            original: searchQuery,
            similar: termTextOriginal,
            lang: from,
          });
        }
        const phraseTranslated = sanitize(
          $(this)
            .find(".trg>.text")
            .text()
            .trim()
        );
        const highlightTranslated = $(this)
          .find(".trg>.text em")
          .map(function() {
            return sanitize(
              $(this)
                .text()
                .trim()
            );
          })
          .get();
        //TODO: solve issue with repeated words like 'mein'
        const termTextTranslated = highlightTranslated.join(" ... ");
        addExamplePhrasePair({
          from,
          to,
          originalTerm: termTextOriginal,
          translatedTerm: termTextTranslated,
          originalPhrase: phraseOriginal,
          translatedPhrase: phraseTranslated,
        });
        search.add.results({ text: termTextOriginal, lang: from });
      });
    });
  });
