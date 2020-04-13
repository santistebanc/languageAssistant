import { observable, action, values } from "mobx";

export const SEPARATOR = "\u00A0";

export const toId = (keys, prefix = "") =>
  prefix + "//" + keys.map(k => (k._id ? k._id : k)).join(SEPARATOR);

export class Index {
  constructor(num, prefix) {
    this.num = num;
    this.prefix = prefix;
  }
  @observable store = {};
  select(path = []) {
    if (path.length < this.num) {
      const res = this.getAll(path);
      const exists = Boolean(res.length);
      const get = exists ? fallback => res : fallback => fallback;
      return { get, exists };
    } else {
      const _id = toId(path, this.prefix);
      const exists = typeof this.store[_id] !== "undefined";
      const get = exists ? fallback => this.get(_id) : fallback => fallback;
      const set = exists ? () => this.get(_id) : value => this.set(_id, value);
      return { get, set, _id, exists };
    }
  }
  getAll(path = []) {
    if (!path.length) return Object.values(this.store);
    const _id = toId(path, this.prefix);
    return Object.entries(this.store)
      .filter(([k, v]) => k.startsWith(_id))
      .map(([k, v]) => v);
  }
  get(_id) {
    return this.store[_id];
  }
  exists(path = []) {
    if (!path.length) return false;
    const _id = toId(path, this.prefix);
    return typeof this.store[_id] !== "undefined";
  }
  @action set(_id, value) {
    return (this.store[_id] = value);
  }
}
