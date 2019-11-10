import {observable, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Bayar {
  bookingData = [];
  imageData = [];
  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  bayar(userId, namaTeam, date, jam, endDate, tanggal, navigation) {
    let data = {userId, namaTeam, date, jam, endDate, tanggal};
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

  upload(image, bookingId) {
    const images = new FormData();
    images.append('image', image);
    images.append('image', {
      uri: image.uri,
      type: image.type,
      name: bookingId + '-' + image.fileName,
    });
    images.append('id', bookingId);
    images.append('fileName', bookingId + '-' + image.fileName);
    fetch(
      `${Endpoint.prod}/upload`,
      {
        method: 'POST',
        body: images,
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(image => {
        if (image.success) {
          this.imageData = image.message;
        } else {
          alert(image.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }
}

decorate(Bayar, {
  bookingData: observable,
});
