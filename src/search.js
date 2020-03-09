import {Platform} from 'react-native';
import translate, {setCORS} from './fetchSources/googleTranslate';
import cheerio from 'cheerio-without-node-native';
import {
  addTranslation,
  addSimilar,
  addSuggestion,
  detectLanguage,
} from './state';
import without from 'lodash/without';

const LANGUAGES = ['eng', 'deu', 'esp'];

const reverso = async (text, from, to) => {
  const corsprefix =
    Platform.OS === 'web' ? 'http://cors-anywhere.herokuapp.com/' : '';

  const mappingLang = lang =>
    ({eng: 'english', deu: 'german', esp: 'spanish'}[lang]);

  const searchUrl =
    corsprefix +
    `https://context.reverso.net/translation/${mappingLang(from)}-${mappingLang(
      to,
    )}/${text.replace(' ', '+')}`;
  try {
    const response = await fetch(searchUrl);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const searchQuery = $('#entry').val();
    if (searchQuery !== text) {
      addSuggestion({
        original: text,
        suggestion: searchQuery,
        lang: from,
        source: 'reverso',
      });
    }
    $('#translations-content>a.translation')
      .slice(1)
      .each(function(i, el) {
        const trans = $(this)
          .text()
          .trim();
        addTranslation({
          terms: {[from]: searchQuery, [to]: trans},
          source: 'reverso',
        });
      });
    $('#seealso-content>a').each(function() {
      const similar = $(this).text();
      addSimilar({
        original: searchQuery,
        similar,
        lang: from,
        source: 'reverso',
      });
    });
    $('#splitting-content>.split.wide-container').each(function() {
      const similar = $(this)
        .find('a.src')
        .text();
      addSimilar({
        original: searchQuery,
        similar,
        lang: from,
        source: 'reverso',
      });
      $(this)
        .find('.trgs>a.translation')
        .each(function() {
          const trans = $(this).text();
          addTranslation({
            terms: {[from]: similar, [to]: trans},
            source: 'reverso',
          });
        });
    });
  } catch (err) {
    console.error(err);
  }
};

const googleTranslate = async (text, from, to) => {
  const trans =
    Platform.OS === 'web'
      ? setCORS('http://cors-anywhere.herokuapp.com/')
      : translate;

  const langMapping = l => ({deu: 'de', eng: 'en', esp: 'es'}[l]);

  return trans(text, {from: langMapping(from), to: langMapping(to)})
    .then(res => {
      if (from !== to) {
        if (res.from.text.value) {
          const correct = res.from.text.value.replace('[', '').replace(']', '');
          addSuggestion({
            original: text,
            suggestion: correct,
            lang: to,
            source: 'googleTranslate',
          });
        }
        addTranslation({
          terms: {[from]: text, [to]: res.text},
          source: 'googleTranslate',
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
};

const googleDetectLanguage = async text => {
  const trans =
    Platform.OS === 'web'
      ? setCORS('http://cors-anywhere.herokuapp.com/')
      : translate;

  return trans(text, {from: 'auto', to: 'en'})
    .then(res => {
      const langMapping = l => ({de: 'deu', en: 'eng', es: 'esp'}[l]);
      const detectedLang = langMapping(res.from.language.iso);
      detectLanguage(detectedLang);
      return detectedLang;
    })
    .catch(err => {
      console.error(err);
    });
};

const searchService = settings => {
  return {
    new: text => startSearch(text, settings),
  };
};

const startSearch = (text, settings) => {
  googleDetectLanguage(text).then(from => {
    const langs = without(LANGUAGES, from);
    langs.forEach(to => {
      googleTranslate(text, from, to);
      reverso(text, from, to);
    });
  });
};

export default searchService;
