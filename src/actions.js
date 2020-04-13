import { Term, Phrase, Fetch } from "./models";

export function addTranslationPair({ from, to, original, translated }) {
  const originalTerm = Term.create({
    text: original,
    lang: from,
  });
  const translationTerm = Term.create({
    text: translated,
    lang: to,
  });
  originalTerm.add.translations(translationTerm);
  translationTerm.add.translations(originalTerm);
  return { fromTerm: originalTerm, toTerm: translationTerm };
}

export function addExamplePhrasePair({
  from,
  to,
  originalPhrase,
  translatedPhrase,
  originalTerm,
  translatedTerm,
}) {
  const { fromTerm, toTerm } = addTranslationPair({
    from,
    to,
    original: originalTerm,
    translated: translatedTerm,
  });
  const examplePhrase1 = fromTerm.add.examplePhrases({
    lang: from,
    text: originalPhrase,
  });
  const examplePhrase2 = toTerm.add.examplePhrases({
    lang: to,
    text: translatedPhrase,
  });
  examplePhrase1.add.terms(fromTerm);
  examplePhrase2.add.terms(toTerm);
  const transPhrase1 = examplePhrase1.add.translations(examplePhrase2);
  const transPhrase2 = examplePhrase2.add.translations(examplePhrase1);
  return { fromPhrase: transPhrase1, toPhrase: transPhrase2 };
}

export function addSimilarTerm({ original, similar, lang, source }) {
  const term = Term.create({
    text: original,
    lang,
  });
  return term.add.similar({
    text: similar,
    lang,
  });
}

export const fetchCall = async (name, params, func) => {
  const fetchFields = {
    name,
    params: JSON.stringify(params),
  };
  const cached = Fetch.get(fetchFields);
  if (cached) {
    return cached;
  } else {
    const start = Date.now();
    return func()
      .then(() =>
        Fetch.create({ ...fetchFields, duration: Date.now() - start })
      )
      .catch((err) => {
        console.log(err);
      });
  }
};
