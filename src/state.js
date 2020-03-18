import {Index} from './utils';
import {pickBy} from 'lodash';

const model = ({fields, type}) => () => {
  const index = new Index();
  const getters = {};
  const setters = {};
  const arrayFields = pickBy(fields, v => v.type === 'array');
  Object.entries(arrayFields).forEach(([k, v]) => {
    console.log('k', k, 'v', v, v.model());
    const modelInArray = typeof v.model === 'function' ? v.model() : v.model;
    getters[k] = function() {
      return Array.from(modelInArray.index.get([this], new Set()));
    };
    setters[k] = function(ModelClass, params) {
      return modelInArray.createAction(ModelClass, {...params, target: this});
    };
  });
  function createAction(ModelClass, params) {
    const instance = new ModelClass(params);
    if (type === 'attached') {
      return index.add([params.target], instance);
    } else {
      const primaryFields = pickBy(params, (v, k) => fields[k] === 'primary');
      return index.set(Object.values(primaryFields), instance);
    }
  }
  function getAction(params) {
    if (type === 'attached') {
      return index.get([params.target]);
    } else {
      const primaryFields = pickBy(params, (v, k) => fields[k] === 'primary');
      return index.get(Object.values(primaryFields));
    }
  }
  return {
    getters,
    setters,
    createAction,
    getAction,
    index,
  };
};

const termModel = model({
  type: 'primitive',
  fields: {
    lang: 'primary',
    text: 'primary',
    sources: {type: 'array', model: () => sourceModel, add: 'addSource'},
    translations: {
      type: 'array',
      model: () => translationModel,
      add: 'addTranslation',
    },
  },
});

const sourceModel = model({
  type: 'attached',
  fields: {
    name: 'primary',
    target: 'target',
  },
});

const translationModel = model({
  type: 'attached',
  fields: {
    target: 'target',
    term: 'other',
  },
});

const MTerm = termModel();
const MSource = sourceModel();
const MTranslation = translationModel();

const createTerm = MTerm.createAction;
const createSource = MSource.createAction;
const createTranslation = MTranslation.createAction;

const getTerm = MTerm.getAction;

class Term {
  constructor(params) {
    this.text = params.text;
    this.lang = params.lang;
  }
  get sources() {
    return MTerm.getters.sources();
  }
  get translations() {
    return MTerm.getters.translations();
  }
  addSource(params) {
    return MTerm.setters.sources(Source, params);
  }
}

class Source {
  constructor(params) {
    this.target = params.target;
    this.name = params.name;
  }
}

class Translation {
  constructor(params) {
    this.target = params.target;
    this.term = params.term;
  }
}

const t = createTerm(Term, {text: 'yoyo', lang: 'en'});
t.addSource({name: 'example'});
createSource(Source, {target: t, name: 'example2'});

const deu = new Term({text: 'wakawaka', lang: 'de'});

createTranslation(Translation, {target: t, term: deu});

console.log('----------', getTerm({text: 'yoyo', lang: 'en'}));
console.log(t);
