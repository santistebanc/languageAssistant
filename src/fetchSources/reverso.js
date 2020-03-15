import {Platform} from 'react-native';
import {Translations} from '../store2';
import cheerio from 'cheerio-without-node-native';

const CORSService = Platform.OS === 'web' ? 'https://cors.x7.workers.dev/' : '';

export const reverso = async (text, from, to) => {
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
      //   addSuggestion({
      //     original: text,
      //     suggestion: searchQuery,
      //     lang: from,
      //     source: 'reverso',
      //   });
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
      //   const similar = $(this).text();
      //   addSimilar({
      //     original: searchQuery,
      //     similar,
      //     lang: from,
      //     source: 'reverso',
      //   });
    });
    $('#splitting-content>.split.wide-container').each(function() {
      const similar = $(this)
        .find('a.src')
        .text();
      //   addSimilar({
      //     original: searchQuery,
      //     similar,
      //     lang: from,
      //     source: 'reverso',
      //   });
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
  } catch (err) {
    console.error(err);
  }
};
