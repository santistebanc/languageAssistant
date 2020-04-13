import { Index } from "./utils";
import { pick, isArray, flatMapDepth, without, omit } from "lodash";
import shortUUID from "short-uuid";
import db from "./db";
import Sync from "./sync";
import { observe } from "mobx";

export const allModels = {};
window.allModels = allModels;

const buildId = id => JSON.stringify(id.map(i => (i._id ? i._id : i)));

class Model {
  hasManyCons = {};
  hasOneCons = {};

  constructor(name, primary) {
    allModels[name] = this;
    this.name = name;
    this.primary = primary;
    this.index = new Index(primary.length, name);
  }

  hasMany = (field, type) => {
    this.hasManyCons[field] = type;
  };

  hasOne = (field, type) => {
    this.hasOneCons[field] = type;
  };

  modelClass = getModelClass(this.hasOneCons, this.hasManyCons);

  create = params => {
    const primaryFields = Object.values(pick(params, this.primary));
    const selection = this.index.select(primaryFields);
    const _id = [this.name, ...primaryFields];
    const res = selection.set(
      new this.modelClass({
        _id,
        model: this.name,
        ...params
      })
    );
    if (!selection.exists) console.log("created", this.name, primaryFields);
    if (!selection.exists) Sync.saveEntity(res.toSave());
    return res;
  };

  get = (params = [], fallback) => {
    const primaryValues = this.primary.map(key => params[key]);
    const primaryFields = without(primaryValues, undefined);
    return this.index.select(primaryFields).get(fallback);
  };
}

export class Field extends Model {
  constructor(name, primary) {
    super(name, primary);
    this.primary = ["origin", ...primary];
  }
  modelClass = function Entity(params) {
    this.dateCreated = Date.now();
    //set normal param fields
    Object.entries(params).forEach(([n, v]) => {
      this[n] = v;
    });
    this.toSave = () => {
      return {
        ...params,
        origin: buildId(params.origin._id),
        _id: buildId(params._id)
      };
    };
  };
}

export class Connection extends Model {
  modelClass = function Entity(params) {
    this.dateCreated = Date.now();
    //set normal param fields
    Object.entries(params).forEach(([n, v]) => {
      this[n] = v;
    });
    this.toSave = () => {
      return {
        ...params,
        origin: buildId(params._id),
        target: params.target && buildId(params._id),
        _id: buildId(params._id)
      };
    };
  };
}

const HasOne = new Connection("Con-HasOne", ["field", "origin"]);
const HasMany = new Connection("Con-HasMany", ["field", "origin", "target"]);

export function getModelClass(hasOneCons, hasManyCons) {
  return function Entity(params) {
    this.dateCreated = Date.now();
    //set normal param fields
    Object.entries(params).forEach(([n, v]) => {
      this[n] = v;
    });
    this.toSave = () => {
      return {
        ...params,
        _id: buildId(params._id)
      };
    };

    //set dynamic fields
    this.set = {};
    this.add = {};
    Object.entries(hasOneCons).forEach(([field, model]) => {
      Object.defineProperty(this, field, {
        get: function() {
          return HasOne.get({ field, origin: this }, {}).target;
        }
      });
      this.set[field] = args => {
        const extra = model instanceof Field ? { origin: this } : {};
        const target = model.create({ ...extra, ...args });
        const con = HasOne.create(
          { field, origin: this._id, target: target._id },
          {}
        );
        Object.defineProperty(con, "origin", {
          get: function() {
            return this;
          }
        });
        Object.defineProperty(con, "target", {
          get: function() {
            return target;
          }
        });
        return con.target;
      };
    });
    Object.entries(hasManyCons).forEach(([field, model]) => {
      Object.defineProperty(this, field, {
        get: function() {
          return HasMany.get({ field, origin: this }, []).map(c => c.target);
        }
      });
      this.add[field] = args => {
        const extra = model instanceof Field ? { origin: this } : {};
        const target = model.create({ ...extra, ...args });
        const con = HasMany.create(
          { field, origin: this._id, target: target._id },
          {}
        );
        Object.defineProperty(con, "origin", {
          get: function() {
            return this;
          }
        });
        Object.defineProperty(con, "target", {
          get: function() {
            return target;
          }
        });
        return con.target;
      };
    });
  };
}

Sync.retrieveFromDB(allModels);

export default Model;
