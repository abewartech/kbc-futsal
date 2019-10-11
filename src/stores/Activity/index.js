import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Activity {
  activityByLine = [];
  counterId = null;
  counter = 0;

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  getActivityByLine(token, params) {
    fetch(
      `${Endpoint.prod}/getactbyline/${params}`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.activityByLine = res.message;
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  setCounterId = data => {
    this.counterId = data;
  };

  setCounter = newCounter => {
    this.counter = newCounter;
  };
}

decorate(Activity, {
  activityByLine: observable,
  getActivityByLine: action,
  counterId: observable,
  setCounterId: action,
  counter: observable,
  setCounter: action,
});
