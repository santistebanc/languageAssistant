import { Index } from "./utils";
import { pick, isArray, flatMapDepth, without, omit } from "lodash";
import db from "./db";
import Sync from "./sync";
import { observe, observable, autorun, action } from "mobx";
import Store from "./Store";

export const allModels = {};
window.allModels = allModels;

class BareEntity {
  constructor(params) {
    this.dateCreated = Date.now();
    //set normal param fields
    Object.entries(params).forEach(([n, v]) => {
      this[n] = v;
    });
  }
}

class BareModel {
  constructor(name, primary) {
    allModels[name] = this;
    this.name = name;
    this.primary = primary;
    this.index = new Index(primary.length, name);
    this.modelClass = BareEntity;
  }

  create = (params) => {
    const primaryFields = Object.values(pick(params, this.primary));
    const selection = this.index.select(primaryFields);
    const _id = selection._id;
    const res = selection.set(
      new this.modelClass({
        _id,
        model: this.name,
        ...params,
      })
    );
    const toSave = omit({ ...res }, ["add", "set"]);
    if (!selection.exists) Sync.saveEntity(toSave);
    return res;
  };

  get = (params = [], fallback) => {
    const primaryValues = this.primary.map((key) => params[key]);
    const primaryFields = without(primaryValues, undefined);
    return this.index.select(primaryFields).get(fallback);
  };
}

export function getModelClass(hasOneCons, hasManyCons) {
  return class Entity extends BareEntity {
    constructor(params) {
      super(params);
      //set dynamic fields
      this.set = {};
      this.add = {};
      Object.entries(hasOneCons).forEach(([field, model]) => {
        Object.defineProperty(this, field, {
          get: function() {
            const tar = HasOne.get({ field, origin: this._id }, {}).target;
            return Store.get(tar);
          },
        });
        this.set[field] = (args) => {
          const extra = model instanceof Field ? { origin: this._id } : {};
          const target = model.create({ ...extra, ...args });
          const con = HasOne.create(
            { field, origin: this._id, target: target._id },
            {}
          );
          return Store.get(con.target);
        };
      });
      Object.entries(hasManyCons).forEach(([field, model]) => {
        Object.defineProperty(this, field, {
          get: function() {
            return HasMany.get({ field, origin: this._id }, []).map((c) =>
              Store.get(c.target)
            );
          },
        });
        this.add[field] = (args) => {
          const extra = model instanceof Field ? { origin: this._id } : {};
          const target = model.create({ ...extra, ...args });
          const con = HasMany.create(
            { field, origin: this._id, target: target._id },
            {}
          );
          return Store.get(con.target);
        };
      });
    }
  };
}

class Model extends BareModel {
  hasManyCons = {};
  hasOneCons = {};

  constructor(name, primary) {
    super(name, primary);
  }
  hasMany = (field, type) => {
    this.hasManyCons[field] = type;
  };

  hasOne = (field, type) => {
    this.hasOneCons[field] = type;
  };

  modelClass = getModelClass(this.hasOneCons, this.hasManyCons);
}

export class Field extends BareModel {
  constructor(name, primary) {
    super(name, primary);
    this.primary = ["origin", ...primary];
  }
}

export class Connection extends BareModel {
  constructor(name, primary) {
    super(name, primary);
  }
}

const HasOne = new Connection("HasOne", ["field", "origin"]);
const HasMany = new Connection("HasMany", ["field", "origin", "target"]);

Sync.retrieveFromDB(allModels);

export default Model;
