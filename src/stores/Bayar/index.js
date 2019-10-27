import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Bayar {
  bookingData = [];
  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  bayar(userId, date, jam, navigation) {
    let data = {userId, date, jam};
    const {token} = this.rooStore.credentialStore;
    fetch(
      `${Endpoint.prod}/addbooking`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(data),
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(booking => {
        if (booking.success) {
          this.bookingData = booking.message;
          navigation.navigate('Bayar');
        } else {
          alert(booking.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }
}

decorate(Bayar, {});
