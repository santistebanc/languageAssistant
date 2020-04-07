import {Platform} from 'react-native';
import cheerio from 'cheerio-without-node-native';
import {transaction} from 'mobx';
import {
  addTranslationPair,
  addSimilarTerm,
  addExamplePhrasePair,
} from '../actions';
import {Fetch, Term} from '../models';
import sanitize from './utils/sanitize';

const CORSService = Platform.OS === 'web' ? 'https://cors.x7.workers.dev/' : '';
const mappingLang = lang =>
  ({en: 'english', de: 'german', es: 'spanish'}[lang]);

export default async (search, {text, from, to}) => {
  const params = {text, from, to};
  const fetchFields = {
    name: 'reverso',
    params: JSON.stringify(params),
  };
  const cached = Fetch.get(fetchFields);
  if (cached) {
    return cached;
  } else {
    try {
      const searchUrl =
        CORSService +
        `https://context.reverso.net/translation/${mappingLang(
          from,
        )}-${mappingLang(to)}/${text.replace(' ', '+')}`;
      const response = await fetch(searchUrl);
      const htmlString = await response.text();
      const $ = cheerio.load(htmlString);
      const searchQuery = sanitize($('#entry').val());
      transaction(() => {
        if (searchQuery !== text) {
          search.add.corrections({
            correction: searchQuery,
            lang: from,
          });
        }
        $('#translations-content>a.translation')
          .slice(1)
          .each(function(i, el) {
            const trans = sanitize(
              $(this)
                .text()
                .trim(),
            );
            const {toTerm} = addTranslationPair({
              from,
              to,
              original: searchQuery,
              translated: trans,
            });
            const freq = sanitize($(this).attr('data-freq'));
            toTerm.add.frequencyScores({freq, weight: 5});
          });
        $('#seealso-content>a').each(function() {
          const similar = sanitize($(this).text());
          addSimilarTerm({
            original: searchQuery,
            similar,
            lang: from,
          });
        });
        $('#splitting-content>.split.wide-container').each(function() {
          const similar = sanitize(
            $(this)
              .find('a.src')
              .text(),
          );
          addSimilarTerm({
            original: searchQuery,
            similar,
            lang: from,
          });
          $(this)
            .find('.trgs>a.translation')
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
        $('#examples-content>.example').each(function() {
          const phraseOriginal = sanitize(
            $(this)
              .find('.src>.text')
              .text()
              .trim(),
          );
          const highlightOriginal = $(this)
            .find('.src>.text em')
            .map(function() {
              return sanitize(
                $(this)
                  .text()
                  .trim(),
              );
            })
            .get();
          const termTextOriginal = highlightOriginal.join(' ... ');
          if (termTextOriginal !== searchQuery) {
            addSimilarTerm({
              original: searchQuery,
              similar: termTextOriginal,
              lang: from,
            });
          }
          const phraseTranslated = sanitize(
            $(this)
              .find('.trg>.text')
              .text()
              .trim(),
          );
          const highlightTranslated = $(this)
            .find('.trg>.text em')
            .map(function() {
              return sanitize(
                $(this)
                  .text()
                  .trim(),
              );
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
          });
          const term = Term.create({text: termTextOriginal, lang: from});
          search.add.results({term});
        });
      });
      return Fetch.create({...fetchFields});
    } catch (err) {
      console.log(err);
    }
  }
};
