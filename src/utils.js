import {observable, action, values} from 'mobx';

export const toObject = (map = new Map(), func) =>
  Object.fromEntries(
    Array.from(
      map.entries(),
      func ||
        (([k, v]) => {
          const vv = v.toJS ? v.toJS() : v;
          const val =
            vv instanceof Map ? toObject(vv) : vv instanceof Set ? [...vv] : vv;
          const kk = k.toJS ? k.toJS() : k;
          const key =
            kk instanceof Map
              ? toObject(kk)
              : typeof kk === 'object'
              ? JSON.stringify(kk)
              : kk;
          return [key, val];
        }),
    ),
  );

const traverse = (map, path = []) => {
  let current = map;
  path.slice(0, -1).forEach(loc => {
    if (!current.has(loc)) {
      current.set(loc, new Map());
    }
    current = current.get(loc);
  });
  return current;
};

export class Index {
  @observable store = new Map();
  @action update(path = [], value) {
    const last = path[path.length - 1];
    let current = this.store;
    path.slice(0, -1).forEach(loc => {
      if (!current.has(loc)) {
        return;
      }
      current = current.get(loc);
    });
    current.set(last, values);
  }
  @action set(path = [], value) {
    const last = path[path.length - 1];
    const location = traverse(this.store, path);
    if (!location.has(last)) {
      location.set(last, value);
    }
    return location.get(last);
  }
  @action add(path = [], value) {
    const last = path[path.length - 1];
    const location = traverse(this.store, path);
    if (!location.has(last)) {
      location.set(last, new Set());
    }
    location.get(last).add(value);
    return value;
  }
  get(path = [], fallback) {
    let current = this.store;
    for (const next of path) {
      if (!current.has(next)) {
        return fallback;
      }
      current = current.get(next);
    }
    if (current.toJS && current.toJS() instanceof Set) {
      return Array.from(current);
    }
    return current;
  }
  has(path = []) {
    return typeof this.get(path) !== 'undefined';
  }
  print(path = []) {
    return toObject(this.get(path));
  }
}
