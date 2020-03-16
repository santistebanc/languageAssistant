import {Platform} from 'react-native';
import {
  Translations,
  Suggestions,
  SimilarTerms,
  ExamplePhrases,
  PhraseTranslations,
} from '../store';
import cheerio from 'cheerio-without-node-native';
import {Index} from '../utils';

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
    if (searchQuery !== text) {
      Suggestions.add({
        original: text,
        suggestion: searchQuery,
        from,
        source: 'reverso',
      });
    }
    $('#translations-content>a.translation')
      .slice(1)
      .each(function(i, el) {
        const trans = $(this)
          .text()
          .trim();
        Translations.add({
          terms: {[from]: searchQuery, [to]: trans},
          source: 'reverso',
        });
      });
    $('#seealso-content>a').each(function() {
      const similar = $(this).text();
      SimilarTerms.add({
        original: searchQuery,
        similar,
        from,
        source: 'reverso',
      });
    });
    $('#splitting-content>.split.wide-container').each(function() {
      const similar = $(this)
        .find('a.src')
        .text();
      SimilarTerms.add({
        original: searchQuery,
        similar,
        from,
        source: 'reverso',
      });
      $(this)
        .find('.trgs>a.translation')
        .each(function() {
          const trans = $(this).text();
          Translations.add({
            terms: {[from]: similar, [to]: trans},
            source: 'reverso',
          });
        });
    });
    $('#examples-content>.example').each(function() {
      const phrase = $(this)
        .find('.src>.text')
        .text()
        .trim();
      const phraseTranslated = $(this)
        .find('.trg>.text')
        .text()
        .trim();
      const termTranslated = $(this)
        .find('.trg>.text>a')
        .text()
        .trim();
      ExamplePhrases.add({
        termText: searchQuery,
        phraseText: phrase,
        lang: from,
        source: 'reverso',
      });
      ExamplePhrases.add({
        termText: termTranslated,
        phraseText: phraseTranslated,
        lang: to,
        source: 'reverso',
      });
      PhraseTranslations.add({
        phrases: {[from]: phrase, [to]: phraseTranslated},
        source: 'reverso',
      });
    });
    cache.set([text, from, to], Date.now());
  } catch (err) {
    console.error(err);
  }
};
