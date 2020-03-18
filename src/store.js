import {Index} from './utils';
import {autorun} from 'mobx';

const termsIndex = new Index();
const phrasesIndex = new Index();
const translationsIndex = new Index();
const phraseTranslationsIndex = new Index();
const suggestionsIndex = new Index();
const similarTermsIndex = new Index();
const examplePhrasesIndex = new Index();
const sourcesIndex = new Index();
const frequencyScoresIndex = new Index();

//complex
export function addTranslationPair({from, to, original, translated, source}) {
  const term1 = addTerm({lang: from, text: original, source});
  const term2 = addTerm({lang: to, text: translated, source});
  const transTerm1 = translationsIndex.add([term1], term2);
  const transTerm2 = translationsIndex.add([term2], term1);
  return {toTerm: transTerm1, fromTerm: transTerm2};
}

export function addExamplePhrasePair({
  from,
  to,
  originalPhrase,
  translatedPhrase,
  originalTerm,
  translatedTerm,
  source,
}) {
  const {fromTerm, toTerm} = addTranslationPair({
    from,
    to,
    original: originalTerm,
    translated: translatedTerm,
    source,
  });
  const phrase1 = fromTerm.addExamplePhrase({
    lang: from,
    text: originalPhrase,
    source,
  });
  const phrase2 = toTerm.addExamplePhrase({
    lang: to,
    text: translatedPhrase,
    source,
  });
  const transTerm1 = phraseTranslationsIndex.add([phrase1], phrase2);
  const transTerm2 = phraseTranslationsIndex.add([phrase2], phrase1);
  return {fromPhrase: transTerm1, toPhrase: transTerm2};
}

//direct
export function getAllTranslations({lang, text}) {
  const term = termsIndex.get([lang, text]);
  return Array.from(translationsIndex.get([term], new Set()));
}

export function getAllPhraseExamples({lang, text}) {
  const term = termsIndex.get([lang, text]);
  return Array.from(examplePhrasesIndex.get([term], new Set()));
}

export function getAllSimilarTerms({lang, text}) {
  const term = termsIndex.get([lang, text]);
  return Array.from(similarTermsIndex.get([term], new Set()));
}

export function getAllSuggestions({lang, text}) {
  const term = termsIndex.get([lang, text]);
  return Array.from(suggestionsIndex.get([term], new Set()));
}

const addTerm = ({lang, text, source}) => {
  const term = termsIndex.set([lang, text], new Term({lang, text}));
  addSource({target: term, name: source.name});
  return term;
};

export function addSuggestion({original, suggestion, lang, source}) {
  const term = addTerm({lang, text: suggestion, source});
  const suggTerm = suggestionsIndex.add([original], term);
  return suggTerm;
}

export function addSimilarTerm({original, similar, lang, source}) {
  const term = addTerm({lang, text: similar, source});
  const simTerm = similarTermsIndex.add([original], term);
  return simTerm;
}

export function addFrequencyScore({target, freq, weight, source}) {
  const freqScore = frequencyScoresIndex.add(
    [target],
    new FrequencyScore({target, freq, weight}),
  );
  addSource({target: freqScore, name: source.name});
  return freqScore;
}

export const addExamplePhrase = ({target, lang, text, source}) => {
  const phrase = addPhrase({lang, text, source});
  const examplePhrase = examplePhrasesIndex.add([target], phrase);
  addSource({target: examplePhrase, name: source.name});
  return phrase;
};

export const addPhrase = ({lang, text, source}) => {
  const phrase = phrasesIndex.set([lang, text], new Phrase({lang, text}));
  addSource({target: phrase, name: source.name});
  return phrase;
};

export const addSource = ({target, name}) => {
  return sourcesIndex.set([target, name], new Source({target, name}));
};

export function getExamplePhrases(term) {
  return Array.from(examplePhrasesIndex.get([term], new Set()));
}

export function getFrequencyScores(target) {
  return Array.from(examplePhrasesIndex.get([target], new Set()));
}

class Term {
  constructor({lang, text}) {
    this.lang = lang;
    this.text = text;
    this.dateCreated = Date.now();
  }
  addExamplePhrase({lang, text, source}) {
    return addExamplePhrase({target: this, lang, text, source});
  }
  get examplePhrases() {
    return getExamplePhrases(this);
  }
  get freq() {
    return getFrequencyScores(this).reduce(
      (average, item, arr) => average + item.freq / arr.length,
      0,
    );
  }
  addFrequencyScore({freq, source, weight}) {
    return addFrequencyScore({target: this, freq, weight, source});
  }
}

class Phrase {
  constructor({lang, text}) {
    this.lang = lang;
    this.text = text;
    this.dateCreated = Date.now();
  }
}

class Source {
  constructor({target, name}) {
    this.target = target;
    this.name = name;
    this.dateCreated = Date.now();
  }
}

class FrequencyScore {
  constructor({target, freq, weight}) {
    this.target = target;
    this.freq = freq;
    this.weight = weight;
    this.dateCreated = Date.now();
  }
}

// autorun(() => {
//   console.log(examplePhrasesIndex.print());
// });
