import Model from "./Model";

export const Search = new Model(["text"]);
export const SearchCorrection = new Model(["correction", "lang"]);
export const DetectedLang = new Model(["lang"]);

export const Fetch = new Model(["name", "params"]);
export const Source = new Model(["name"]);

export const Term = new Model(["text", "lang"]);
export const Phrase = new Model(["text", "lang"]);

Term.connect("sources", [Source]);
Term.connect("translations", [Term]);
Term.connect("similar", [Term]);
Term.connect("examplePhrases", [Phrase]);

Phrase.connect("sources", [Source]);
Phrase.connect("translations", [Phrase]);
Phrase.connect("terms", [Term]);

Search.connect("results", [Term]);
Search.connect("corrections", [SearchCorrection]);
Search.connect("detectedLang", DetectedLang);
