import { observe, observable, autorun } from "mobx";

const Store = observable(new Map());

window.Store = Store;

export default Store;
