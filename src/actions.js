import Actions from './models';

const {createTerm, createPhrase, createFrequencyScore, createSource} = Actions;

const createTermWithSource = ({lang, text, source}) => {
  const term = createTerm({lang, text});
  term.addSource({name: source});
  return term;
};

const createPhraseWithSource = ({lang, text, source}) => {
  const phrase = createPhrase({lang, text});
  phrase.addSource({name: source});
  return phrase;
};

//complex
export function addTranslationPair({from, to, original, translated, source}) {
  const term1 = createTermWithSource({lang: from, text: original, source});
  const term2 = createTermWithSource({lang: to, text: translated, source});
  const transTerm1 = term1.addTranslation({term: term2});
  const transTerm2 = term2.addTranslation({term: term1});
  return {toTerm: transTerm1.term, fromTerm: transTerm2.term};
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
  const examplePhrase1 = fromTerm.addExamplePhrase({
    phrase: createPhraseWithSource({
      lang: from,
      text: originalPhrase,
      source,
    }),
  });
  const examplePhrase2 = toTerm.addExamplePhrase({
    phrase: createPhraseWithSource({
      lang: to,
      text: translatedPhrase,
      source,
    }),
  });
  const transPhrase1 = examplePhrase1.phrase.addTranslation({
    phrase: examplePhrase2.phrase,
  });
  const transPhrase2 = examplePhrase2.phrase.addTranslation({
    phrase: examplePhrase1.phrase,
  });
  return {fromPhrase: transPhrase1.phrase, toPhrase: transPhrase2.phrase};
}

//direct
export function getAllTranslations({lang, text}) {
  return createTerm({lang, text}).translations.map(it => it.term);
}

export function getAllPhraseExamples({lang, text}) {
  return createTerm({lang, text}).examplePhrases.map(it => it.phrase);
}

export function getAllSimilarTerms({lang, text}) {
  return createTerm({lang, text}).similarTerms.map(it => it.term);
}

export function getAllSuggestionTerms({lang, text}) {
  return createTerm({lang, text}).suggestionTerms.map(it => it.term);
}

export function addSuggestion({original, suggestion, lang, source}) {
  const term = createTermWithSource({lang, text: original, source});
  const suggTerm = createTermWithSource({lang, text: suggestion, source});
  return term.addSuggestionTerm({term: suggTerm});
}

export function addSimilarTerm({original, similar, lang, source}) {
  const term = createTermWithSource({lang, text: original, source});
  const simTerm = createTermWithSource({lang, text: similar, source});
  return term.addSimilarTerm({term: simTerm});
}

export function addFrequencyScore({target, freq, weight, source}) {
  let src = {};
  const freqScore = createFrequencyScore({target, freq, weight, source: src});
  src = createSource({target: freqScore, name: source});
  return freqScore;
}
