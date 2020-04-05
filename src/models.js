import generateState from './generateState';

const Search = {
  primary: ['text'],
  derived: {
    searchResults: {
      model: 'SearchResult',
      type: 'array',
      actions: {
        add: 'addSearchResult',
      },
    },
    detectedLang: {
      model: 'DetectedLang',
      type: 'object',
      actions: {
        set: 'setDetectedLang',
      },
    },
  },
  other: {
    lang: {
      actions: {
        update: 'updateLang',
      },
    },
  },
  actions: {
    create: 'createSearch',
    get: 'getSearch',
  },
};

const SearchResult = {
  primary: ['target', 'result'],
  actions: {
    create: 'createSearchResult',
    get: 'getSearchResult',
  },
};

const DetectedLang = {
  primary: ['target', 'lang'],
  actions: {
    create: 'createDetectedLang',
    get: 'getDetectedLang',
  },
};

const Fetch = {
  primary: ['target'],
  actions: {
    create: 'createFetch',
    get: 'getFetch',
  },
};

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
    },
    examplePhrases: {
      model: 'ExamplePhrase',
      type: 'array',
      actions: {
        add: 'addExamplePhrase',
      },
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

const Phrase = {
  primary: ['text', 'lang'],
  actions: {
    create: 'createPhrase',
    get: 'getPhrase',
  },
  derived: {
    sources: {
      model: 'Source',
      type: 'array',
      actions: {
        add: 'addSource',
      },
    },
    translations: {
      model: 'PhraseTranslation',
      type: 'array',
      actions: {
        add: 'addTranslation',
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

const config = {
  models: {
    Search,
    SearchResult,
    DetectedLang,
    Fetch,
    Term,
    Phrase,
    Source,
    Translation,
    PhraseTranslation,
    SimilarTerm,
    SuggestionTerm,
    ExamplePhrase,
    FrequencyScore,
  },
};
export default generateState(config);
