import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Admin {
  constructor(rooStore) {
    this.rooStore = rooStore;
  }
}

decorate(Admin, {});
