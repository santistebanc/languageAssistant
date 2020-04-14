import { observable, autorun, action, reaction, toJS } from "mobx";
import { zipObject } from "lodash";
import db from "./db";

class SyncService {
  @observable batchToSave = {};
  @action saveEntity = (entity) => {
    this.batchToSave[entity._id] = { ...entity };
  };
  commitBatchToDB = reaction(
    () => toJS(this.batchToSave),
    (docs) => {
      const vals = Object.values(docs);
      db.bulkDocs(vals).then(() =>
        console.log("saved to db", vals.length, vals)
      );
    },
    { delay: 5000 }
  );
  retrieveFromDB = (allModels) => {
    db.allDocs({
      include_docs: true,
    }).then((docs) => {
      const res = docs.rows.map((row) => {
        const doc = { ...row.doc };
        const ModelClass = allModels[doc.model].create(doc);
      });
      console.log("hydrated db", res.length);
      return res;
    });
  };
}

export default new SyncService();
