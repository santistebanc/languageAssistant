import {observable, action} from 'mobx';

export const toObject = (map = new Map(), func) =>
  Object.fromEntries(
    Array.from(
      map.entries(),
      func ||
        (([k, v]) => {
          const val = v instanceof Map ? toObject(v) : v;
          const key =
            k instanceof Map
              ? toObject(k)
              : typeof k === 'object'
              ? JSON.stringify(k)
              : k;
          return [key, val];
        }),
    ),
  );

export class Index {
  @observable store = new Map();
  @action index(path = [], value) {
    return path.reduce((current, next, i) => {
      if (!current.has(next)) {
        const payload = i === path.length - 1 ? value : new Map();
        current.set(next, payload);
        if (i === path.length - 1 && typeof value === 'undefined') {
          return next;
        }
      }
      return current.get(next);
    }, this.store);
  }
  get(path = []) {
    let current = this.store;
    for (const next of path) {
      if (!current.has(next)) {
        return;
      }
      current = current.get(next);
    }
    return current;
  }
  print(path = []) {
    return toObject(this.get(path));
  }
}
