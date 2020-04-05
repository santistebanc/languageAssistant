import {Index} from './utils';
import {pick, isArray, flatMapDepth, without} from 'lodash';

export default function Model(primary) {
  this.index = new Index();
  const derived = {};
  this.connect = function (name, type) {
    derived[name] = type;
  };

  this.modelClass = class {
    constructor(params) {
      this.dateCreated = Date.now();
      //set normal param fields
      Object.entries(params).forEach(([n, v]) => {
        this[n] = v;
      });
      //set array fields
      this.add = {};
      this.set = {};
      Object.entries(derived).forEach(([n, v]) => {
        if (isArray(v)) {
          Object.defineProperty(this, n, {
            get: function () {
              return v[0].get({target: this}, []);
            },
          });
          this.add[n] = (args) => {
            return v[0].create({
              target: this,
              ...args,
            });
          };
        } else {
          Object.defineProperty(this, n, {
            get: function () {
              return v.get({target: this});
            },
          });
          this.set[n] = (args) => {
            return v.create({
              target: this,
              ...args,
            });
          };
        }
      });
    }
  };
  this.create = (params) => {
    const primaryFields = Object.values(pick(params, primary));
    return this.index.set(primaryFields, new this.modelClass(params));
  };
  this.get = (params, fallback) => {
    const primaryValues = primary.map((key) => params[key]);
    const primaryFields = without(primaryValues, undefined);
    const res = this.index.get(primaryFields);
    const level = primary.length - primaryFields.length;
    if (res && level === 1) {
      return [...res.values()];
    } else if (res && level > 1) {
      return flatMapDepth(
        [...res.values()],
        (val) => (isArray(val) ? val : [...val.values()]),
        level - 1,
      );
    }
    return res || fallback;
  };
}
