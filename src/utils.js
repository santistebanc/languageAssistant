import shortUUID from "short-uuid";
import Store from "./Store";
import { observable } from "mobx";

export const SEPARATOR = "\u00A0";

export const toId = (keys, prefix = "") =>
  prefix + "/" + keys.map((k) => (k._id ? k._id : k)).join(SEPARATOR);

export class Index {
  constructor(num, prefix) {
    this.num = num;
    this.prefix = prefix;
  }
  select(path = []) {
    if (path.length < this.num) {
      const res = this.getAll(path);
      const exists = Boolean(res.length);
      const get = exists ? (fallback) => res : (fallback) => fallback;
      return { get, exists };
    } else {
      const _id = toId(path, this.prefix);
      const exists = this.exists(path);
      const get = exists ? () => this.get(_id) : (fallback) => fallback;
      const set = exists
        ? () => this.get(_id)
        : (value) => this.set(_id, value);
      return { get, set, _id, exists };
    }
  }
  getAll(path = []) {
    const _id = toId(path, this.prefix);
    return [...Store.entries()]
      .filter(([k, v]) => k.startsWith(_id))
      .map(([k, v]) => v);
  }
  get(_id) {
    return Store.get(_id);
  }
  exists(path = []) {
    if (!path.length) return false;
    const _id = toId(path, this.prefix);
    return typeof Store.get(_id) !== "undefined";
  }
  set(_id, value) {
    Store.set(_id, value);
    return Store.get(_id);
  }
}
