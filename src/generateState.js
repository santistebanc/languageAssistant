import {Index} from './utils';
import {pick, pickBy, flatMapDepth, isArray} from 'lodash';

export default function generate(defs) {
  const indices = Object.fromEntries(
    Object.entries(defs.models).map(([name, model]) => [name, new Index()]),
  );
  // eslint-disable-next-line consistent-this
  const self = this;
  this.modelClasses = Object.fromEntries(
    Object.entries(defs.models).map(([name, model]) => {
      const arrayFields = pickBy(model.derived, prop => prop.type === 'array');
      const customGetters = model.custom?.getters || {};
      const modelClass = class {
        constructor(params) {
          //set normal param fields
          Object.entries(params).forEach(([n, v]) => {
            this[n] = v;
          });
          //set array fields
          Object.entries(arrayFields).forEach(([n, v]) => {
            const modelActions = self.actions[v.model];
            if (!v.hide) {
              Object.defineProperty(this, n, {
                get: function() {
                  return modelActions.getAction({target: this});
                },
              });
            }
            this[v.actions.add] = function(args) {
              return modelActions.createAction({
                ...args,
                target: this,
              });
            };
          });
          //set custom getters
          Object.entries(customGetters).forEach(([n, func]) => {
            Object.defineProperty(this, n, {
              get: func.bind(this, self.actions),
            });
          });
        }
      };
      //   Object.defineProperty(modelClass, 'name', {value: name});
      return [name, modelClass];
    }),
  );

  this.actions = Object.fromEntries(
    Object.entries(defs.models).map(([name, model]) => {
      const index = indices[name];
      const ModelClass = this.modelClasses[name];
      function createAction(params) {
        const instance = new ModelClass(params);
        const primaryFields = Object.values(pick(params, model.primary));
        return index.set(primaryFields, instance);
      }
      function getAction(params, fallback) {
        const primaryFields = Object.values(pick(params, model.primary));
        const res = index.print(primaryFields, fallback);
        const level = model.primary.length - primaryFields.length;
        console.log('level', level);
        if (level === 1) {
          return Object.values(res);
        } else if (level > 1) {
          return flatMapDepth(
            Object.values(res),
            val => (isArray(val) ? val : Object.values(val)),
            level - 1,
          );
        }
        return res;
      }
      return [
        name,
        {
          createAction,
          getAction,
        },
      ];
    }),
  );
  return Object.fromEntries(
    Object.entries(defs.models).map(([name, model]) => [
      name,
      {
        [model.actions.create]: this.actions[name].createAction,
        [model.actions.get]: this.actions[name].getAction,
      },
    ]),
  );
}
