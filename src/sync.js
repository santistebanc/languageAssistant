import { observable, autorun, action, reaction, toJS } from "mobx";
import { zipObject } from "lodash";
import db from "./db";

class SyncService {
  @observable batchToSave = {};
  @action saveEntity = entity => {
    this.batchToSave[entity._id] = { ...entity };
  };
  commitBatchToDB = reaction(
    () => toJS(this.batchToSave),
    docs => {
      const vals = Object.values(docs);
      console.log("to be saved to db", vals);
      db.bulkDocs(vals).then(() =>
        console.log("saved to db", vals.length, vals)
      );
    },
    { delay: 5000 }
  );
  retrieveFromDB = allModels => {
    db.allDocs({
      include_docs: true
    }).then(docs => {
      const res = docs.rows.map(row => {
        const doc = { ...row.doc };
        const parsed = JSON.parse(doc._id);
        const [model] = parsed;
        const ModelClass = allModels[doc.model];
        console.log(model, doc);
        // const origin = ModelClass.create(doc);
        // return ModelClass.index.set(zipObject(ModelClass.primary, params), doc);
      });
      console.log("hydrated db", res.length);
      return res;
    });
  };
}

export default new SyncService();
