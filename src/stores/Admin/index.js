import {decorate} from 'mobx';

export class Admin {
  constructor(rooStore) {
    this.rooStore = rooStore;
  }
}

decorate(Admin, {});
