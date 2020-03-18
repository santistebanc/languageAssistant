import {Platform} from 'react-native';
import cheerio from 'cheerio-without-node-native';
import {Index} from '../utils';
import {transaction} from 'mobx';
import {
  addTranslationPair,
  addSuggestion,
  addSimilarTerm,
  addExamplePhrasePair,
  addFrequencyScore,
} from '../actions';

const CORSService = Platform.OS === 'web' ? 'https://cors.x7.workers.dev/' : '';

const cache = new Index();

export const reverso = async (text, from, to) => {
  if (cache.has([text, from, to])) {
    return;
  }
  const mappingLang = lang =>
    ({en: 'english', de: 'german', es: 'spanish'}[lang]);

  const searchUrl =
    CORSService +
    `https://context.reverso.net/translation/${mappingLang(from)}-${mappingLang(
      to,
    )}/${text.replace(' ', '+')}`;
  try {
    const response = await fetch(searchUrl);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const searchQuery = $('#entry').val();
    transaction(() => {
      const source = {name: 'reverso', action: 'searchFetch'};
      if (searchQuery !== text) {
        addSuggestion({
          original: text,
          suggestion: searchQuery,
          lang: from,
          source,
        });
      }
      $('#translations-content>a.translation')
        .slice(1)
        .each(function(i, el) {
          const trans = $(this)
            .text()
            .trim();
          const {toTerm} = addTranslationPair({
            from,
            to,
            original: searchQuery,
            translated: trans,
            source,
          });
          const freq = $(this).attr('data-freq');
          addFrequencyScore({target: toTerm, freq, weight: 5});
        });
      $('#seealso-content>a').each(function() {
        const similar = $(this).text();
        addSimilarTerm({
          original: searchQuery,
          similar,
          lang: from,
          source,
        });
      });
      $('#splitting-content>.split.wide-container').each(function() {
        const similar = $(this)
          .find('a.src')
          .text();
        addSimilarTerm({
          original: searchQuery,
          similar,
          lang: from,
          source,
        });
        $(this)
          .find('.trgs>a.translation')
          .each(function() {
            const trans = $(this).text();
            addTranslationPair({
              from,
              to,
              original: similar,
              translated: trans,
              source,
            });
          });
      });
      $('#examples-content>.example').each(function() {
        const phraseOriginal = $(this)
          .find('.src>.text')
          .text()
          .trim();
        const highlightOriginal = $(this)
          .find('.src>.text em')
          .map(function() {
            return $(this)
              .text()
              .trim();
          })
          .get();
        const termTextOriginal = highlightOriginal.join(' ... ');
        if (termTextOriginal !== searchQuery) {
          addSimilarTerm({
            original: searchQuery,
            similar: termTextOriginal,
            lang: from,
            source,
          });
        }
        const phraseTranslated = $(this)
          .find('.trg>.text')
          .text()
          .trim();
        const highlightTranslated = $(this)
          .find('.trg>.text em')
          .map(function() {
            return $(this)
              .text()
              .trim();
          })
          .get();
        //TODO: solve issue with repeated words like 'mein'
        const termTextTranslated = highlightTranslated.join(' ... ');
        addExamplePhrasePair({
          from,
          to,
          originalTerm: termTextOriginal,
          translatedTerm: termTextTranslated,
          originalPhrase: phraseOriginal,
          translatedPhrase: phraseTranslated,
          source,
        });
      });
      cache.set([text, from, to], Date.now());
    });
  } catch (err) {
    console.error(err);
  }
};
