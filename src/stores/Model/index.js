import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Model {
  allModel = [];
  selectedModel = null;

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  getModel(token) {
    fetch(
      `${Endpoint.prod}/getallmoulds`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.allModel = res.message;
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }
}

decorate(Model, {
  allModel: observable,
  selectedModel: observable,
  getModel: action,
});
