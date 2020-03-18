export default class Term {
  constructor({lang, text}) {
    this.lang = lang;
    this.text = text;
  }
  addExamplePhrase({lang, text, source}) {
    return addExamplePhraseWithSource({target: this, lang, text, source});
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
  addFrequencyScore({freq, source}) {
    return addFrequencyScoreWithSource({target: this, freq, source});
  }
}
