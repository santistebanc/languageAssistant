import {Index} from './utils';
import {pickBy} from 'lodash';

const model = ({fields, type}) => {
  const index = new Index();
  const arrayFields = pickBy(fields, v => v.type === 'array');
  function construct(args) {
    const instance = {...args};
    Object.entries(arrayFields).forEach(([k, v]) => {
      console.log('inside', k, v);
      const modelInArray = typeof v.model === 'function' ? v.model() : v.model;
      instance[v.add || 'add_to_' + k] = function(params) {
        return modelInArray.createAction({...params, target: this});
      };
      Object.defineProperty(instance, k, {
        get: function() {
          return Array.from(modelInArray.index.get([this], new Set()));
        },
      });
    });
    //set in index
    if (type === 'attached') {
      return index.add([args.target], instance);
    } else {
      const primaryFields = pickBy(args, (v, k) => fields[k] === 'primary');
      return index.set(Object.values(primaryFields), instance);
    }
  }
  function createAction(params) {
    return construct(params);
  }
  console.log('here');
  return {
    construct,
    createAction,
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

const createTerm = termModel.createAction;
const createSource = sourceModel.createAction;
const createTranslation = translationModel.createAction;

const t = createTerm({text: 'yoyo', lang: 'en'});
const res = t.addSource({name: 'example'});
createSource({target: t, name: 'example2'});

const deu = createTerm({text: 'wakawaka', lang: 'de'});

createTranslation({target: t, term: deu});

console.log('----------', res);
console.log(t);
