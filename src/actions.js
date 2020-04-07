import {Term, Phrase} from './models';

export function addTranslationPair({from, to, original, translated}) {
  const originalTerm = Term.create({
    text: original,
    lang: from,
  });
  const translationTerm = Term.create({
    text: translated,
    lang: to,
  });
  originalTerm.add.translations({
    term: translationTerm,
  });
  translationTerm.add.translations({
    term: originalTerm,
  });
  return {fromTerm: originalTerm, toTerm: translationTerm};
}

export function addExamplePhrasePair({
  from,
  to,
  originalPhrase,
  translatedPhrase,
  originalTerm,
  translatedTerm,
}) {
  const {fromTerm, toTerm} = addTranslationPair({
    from,
    to,
    original: originalTerm,
    translated: translatedTerm,
  });
  const examplePhrase1 = fromTerm.add.examplePhrases({
    phrase: Phrase.create({
      lang: from,
      text: originalPhrase,
    }),
  });
  const examplePhrase2 = toTerm.add.examplePhrases({
    phrase: Phrase.create({
      lang: to,
      text: translatedPhrase,
    }),
  });
  const transPhrase1 = examplePhrase1.phrase.add.translations({
    phrase: examplePhrase2.phrase,
  });
  const transPhrase2 = examplePhrase2.phrase.add.translations({
    phrase: examplePhrase1.phrase,
  });
  return {fromPhrase: transPhrase1.phrase, toPhrase: transPhrase2.phrase};
}

// //direct
// export function getAllTranslations({lang, text}) {
//   return getTerm({lang, text})?.translations?.map((it) => it.term) || [];
// }

// export function getAllPhraseExamples({lang, text}) {
//   return getTerm({lang, text})?.examplePhrases?.map((it) => it.phrase) || [];
// }

// export function getAllSimilarTerms({lang, text}) {
//   return getTerm({lang, text})?.similarTerms?.map((it) => it.term) || [];
// }

// export function getAllSuggestionTerms({lang, text}) {
//   return getTerm({lang, text})?.suggestionTerms?.map((it) => it.term) || [];
// }

// export function addSuggestion({original, suggestion, lang, source}) {
//   const term = createTermWithSource({lang, text: original, source});
//   const suggTerm = createTermWithSource({lang, text: suggestion, source});
//   return term.addSuggestionTerm({term: suggTerm});
// }

export function addSimilarTerm({original, similar, lang, source}) {
  const term = Term.create({
    text: original,
    lang,
  });
  const simTerm = Term.create({
    text: similar,
    lang,
  });
  return term.add.similar({term: simTerm});
}

// export function addFrequencyScore({target, freq, weight, source}) {
//   let src = {};
//   const freqScore = createFrequencyScore({target, freq, weight, source: src});
//   src = createSource({target: freqScore, name: source});
//   return freqScore;
// }
