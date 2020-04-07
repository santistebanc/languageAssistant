import Model from './Model';

export const Search = new Model(['text']);
export const SearchResult = new Model(['target', 'term']);
export const SearchCorrection = new Model(['target', 'correction', 'lang']);
export const DetectedLang = new Model(['target']);

export const Fetch = new Model(['name', 'params']);
export const Source = new Model(['target', 'name']);

export const Term = new Model(['text', 'lang']);
export const Translation = new Model(['target', 'term']);
export const SimilarTerm = new Model(['target', 'term']);
export const ExamplePhrase = new Model(['target', 'phrase']);
export const FrequencyScore = new Model(['target', 'source']);
export const Phrase = new Model(['text', 'lang']);
export const PhraseTranslation = new Model(['target', 'phrase']);

Term.connect('sources', [Source]);
Term.connect('translations', [Translation]);
Term.connect('similar', [SimilarTerm]);
Term.connect('examplePhrases', [ExamplePhrase]);
Term.connect('frequencyScores', [FrequencyScore]);

Phrase.connect('sources', [Source]);
Phrase.connect('translations', [PhraseTranslation]);

Search.connect('results', [SearchResult]);
Search.connect('corrections', [SearchCorrection]);
Search.connect('detectedLang', DetectedLang);
