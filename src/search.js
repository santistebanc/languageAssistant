import {Platform} from 'react-native';
import translate, {setCORS} from './fetchSources/googleTranslate';
import cheerio from 'cheerio-without-node-native';
import {addTranslation, addSimilar, addSuggestion} from './state';

const reverso = async (text, lang) => {
  const corsprefix =
    Platform.OS === 'web' ? 'http://cors-anywhere.herokuapp.com/' : '';

  const language = {eng: 'english', deu: 'german', esp: 'spanish'}[lang];

  const searchUrl =
    corsprefix +
    `https://context.reverso.net/translation/german-${language}/${text.replace(
      ' ',
      '+',
    )}`;
  try {
    const response = await fetch(searchUrl);
    const htmlString = await response.text();
    const $ = cheerio.load(htmlString);
    const searchQuery = $('#entry').val();
    if (searchQuery !== text) {
      addSuggestion({
        original: text,
        suggestion: searchQuery,
        lang: 'deu',
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
          terms: {deu: searchQuery, [lang]: trans},
          source: 'reverso',
        });
      });
    $('#seealso-content>a').each(function() {
      const similar = $(this).text();
      addSimilar({
        original: searchQuery,
        similar,
        lang: 'deu',
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
        lang: 'deu',
        source: 'reverso',
      });
      $(this)
        .find('.trgs>a.translation')
        .each(function() {
          const trans = $(this).text();
          addTranslation({
            terms: {deu: similar, [lang]: trans},
            source: 'reverso',
          });
        });
    });
  } catch (err) {
    console.error(err);
  }
};

const googleTranslate = async (text, lang) => {
  const trans =
    Platform.OS === 'web'
      ? setCORS('http://cors-anywhere.herokuapp.com/')
      : translate;

  return trans(text, {from: 'de', to: lang})
    .then(res => {
      const langCode = {de: 'deu', en: 'eng', es: 'esp'}[lang];
      if (res.from.text.value) {
        const correct = res.from.text.value.replace('[', '').replace(']', '');
        addSuggestion({
          original: text,
          suggestion: correct,
          lang: langCode,
          source: 'googleTranslate',
        });
        if (res.from.text.autoCorrected) {
          addTranslation({
            terms: {deu: correct, [langCode]: res.text},
            source: 'googleTranslate',
          });
        }
      } else {
        addTranslation({
          terms: {deu: text, [langCode]: res.text},
          source: 'googleTranslate',
        });
      }
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
  googleTranslate(text, 'en');
  googleTranslate(text, 'es');
  reverso(text, 'eng');
  reverso(text, 'esp');
};

export default searchService;
