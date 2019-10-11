import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Line {
  allLine = [];
  selectedLine = null;

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  getLine(token) {
    fetch(
      `${Endpoint.prod}/getalllines`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.allLine = res.message;
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  setSelectedLine = line => {
    this.selectedLine = line;
  };
}

decorate(Line, {
  allLine: observable,
  selectedLine: observable,
  getLine: action,
  setSelectedLine: action,
});
