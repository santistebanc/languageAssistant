import generateState from './generateState';

const Term = {
  primary: ['text', 'lang'],
  derived: {
    sources: {
      model: 'Source',
      type: 'array',
      actions: {
        add: 'addSource',
      },
    },
    translations: {
      model: 'Translation',
      type: 'array',
      actions: {
        add: 'addTranslation',
      },
    },
    similarTerms: {
      model: 'SimilarTerm',
      type: 'array',
      actions: {
        add: 'addSimilarTerm',
      },
    },
    suggestionTerms: {
      model: 'SuggestionTerm',
      type: 'array',
      actions: {
        add: 'addSuggestionTerm',
      },
    },
    frequencyScores: {
      model: 'FrequencyScore',
      type: 'array',
      actions: {
        add: 'addFrequencyScore',
      },
      hide: true,
    },
  },
  actions: {
    create: 'createTerm',
    get: 'getTerm',
  },
  custom: {
    getters: {
      freq: function(Actions) {
        return Actions.FrequencyScore.getAction({target: this}, []).reduce(
          (av, score, i, arr) => av + score.freq / arr.length,
          0,
        );
      },
    },
  },
};

const Source = {
  primary: ['target', 'name'],
  actions: {
    create: 'createSource',
    get: 'getSource',
  },
};

const Translation = {
  primary: ['target', 'term'],
  actions: {
    create: 'createTranslation',
    get: 'getTranslation',
  },
};

const PhraseTranslation = {
  primary: ['target', 'phrase'],
  actions: {
    create: 'createPhraseTranslation',
    get: 'getPhraseTranslation',
  },
};

const SimilarTerm = {
  primary: ['target', 'term'],
  actions: {
    create: 'createSimilarTerm',
    get: 'getSimilarTerm',
  },
};

const SuggestionTerm = {
  primary: ['target', 'term'],
  actions: {
    create: 'createSuggestionTerm',
    get: 'getSuggestionTerm',
  },
};

const ExamplePhrase = {
  primary: ['target', 'phrase'],
  actions: {
    create: 'createExamplePhrase',
    get: 'getExamplePhrase',
  },
};

const FrequencyScore = {
  primary: ['target', 'source'],
  actions: {
    create: 'createFrequencyScore',
    get: 'getFrequencyScore',
  },
};

const definitions = {
  models: {
    Term,
    Source,
    Translation,
    PhraseTranslation,
    SimilarTerm,
    SuggestionTerm,
    ExamplePhrase,
    FrequencyScore,
  },
};

const {
  Term: {createTerm, getTerm},
  Source: {createSource},
} = generateState(definitions);

console.log('generated!!');

const t = createTerm({text: 'yoyo', lang: 'en'});
t.addSource({name: 'example'});
t.addSource({name: 'example'});
t.addSource({name: 'example3'});
t.addFrequencyScore({
  freq: 100,
  weight: 5,
  source: createSource({target: t, name: 'example'}),
});
t.addFrequencyScore({
  freq: 200,
  weight: 5,
  source: createSource({target: t, name: 'example3'}),
});
t.addFrequencyScore({
  freq: 500,
  weight: 5,
  source: createSource({target: t, name: 'example2'}),
});
t.addTranslation({term: createTerm({text: 'wakawaka', lang: 'de'})});
t.addTranslation({term: createTerm({text: 'wakawaka', lang: 'en'})});
console.log(t.freq);
createSource({target: t, name: 'example2'});

// console.log('----------', getTerm({text: 'yoyo', lang: 'en'}));
