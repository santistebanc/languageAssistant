import PouchDB from "pouchdb";
import WorkerPouch from "worker-pouch";
PouchDB.adapter("worker", WorkerPouch);

const db = new PouchDB("languageAssistant");

export default db;
