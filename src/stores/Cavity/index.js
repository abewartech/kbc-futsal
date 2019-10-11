import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Cavity {
  allCavity = [];
  selectedCavity = null;

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  getCavity(token) {
    fetch(
      `${Endpoint.prod}/getallcavities`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.allCavity = res.message;
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }
}

decorate(Cavity, {
  allCavity: observable,
  getCavity: action,
  selectedCavity: observable,
});
