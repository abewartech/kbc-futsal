import {decorate} from 'mobx';

export class Home {
  constructor(rooStore) {
    this.rooStore = rooStore;
  }
}

decorate(Home, {});
