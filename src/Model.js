import { Index } from "./utils";
import { pick, isArray, flatMapDepth, without } from "lodash";

export const Connection = new Model(["name", "origin", "target"]);

export default function Model(primary) {
  this.index = new Index();
  const derived = {};
  this.connect = function(name, type) {
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
            get: function() {
              return Connection.get({ name: n, origin: this }, []).map(
                (con) => con.target
              );
            },
          });
          this.add[n] = (args) => {
            const target = v[0].create({ ...args });
            return Connection.create({
              name: n,
              origin: this,
              target,
            }).target;
          };
        } else {
          Object.defineProperty(this, n, {
            get: function() {
              return Connection.get({ name: n, origin: this }, [])[0]?.target;
            },
          });
          this.set[n] = (args) => {
            const target = v.create({ ...args });
            const existing = Connection.get({ name: n, origin: this }, [])[0]
              ?.target;
            return (
              existing ||
              Connection.create({
                name: n,
                origin: this,
                target,
              }).target
            );
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
        level - 1
      );
    }
    return res || fallback;
  };
}
