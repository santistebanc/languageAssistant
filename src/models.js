import Model, { Field } from "./Model";

export const Search = new Model("Search", ["text"]);
export const SearchCorrection = new Model("SearchCorrection", [
  "correction",
  "lang"
]);

export const Fetch = new Model("Fetch", ["name", "params"]);
export const Source = new Model("Source", ["name"]);

export const Term = new Model("Term", ["text", "lang"]);
export const Phrase = new Model("Phrase", ["text", "lang"]);

export const DetectedLang = new Field("DetectedLang", ["lang"]);
export const FrequencyScore = new Field("FrequencyScore", ["source"]);

Term.hasMany("sources", Source);
Term.hasMany("translations", Term);
Term.hasMany("similar", Term);
Term.hasMany("examplePhrases", Phrase);
Term.hasMany("frequencyScores", FrequencyScore);

Phrase.hasMany("sources", Source);
Phrase.hasMany("translations", Phrase);
Phrase.hasMany("terms", Term);

Search.hasMany("results", Term);
Search.hasMany("corrections", SearchCorrection);
Search.hasOne("detectedLang", DetectedLang);
