import {decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';
import moment from 'moment';

export class Admin {
  reportData = [];
  reportDataPemasukan = [];
  date = '';
  dateTo = '';

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  report(date, dateTo, navigation) {
    let data = {date, dateTo};
    const {token} = this.rooStore.credentialStore;
    fetch(
      `${Endpoint.prod}/report`,
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
      .then((res) => res.json())
      .then((report) => {
        if (report.success) {
          this.reportData = [];
          report.message.map((val) => {
            this.reportData.push(
              `<tr style="text-align:center">
                <td>${val.prevId}</td>
                <td>${val.namaTeam}</td>
                <td>${moment(val.date).format('DD MMMM YYYY ~ HH:mm')}</td>
                <td>${val.jam}</td>
              </tr>`,
            );
          });
          this.date = date;
          this.dateTo = dateTo;
        } else {
          alert(report.message);
        }
      })
      .catch((error) => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  reportpemasukan(date, dateTo, navigation) {
    let data = {date, dateTo};
    const {token} = this.rooStore.credentialStore;
    fetch(
      `${Endpoint.prod}/reportpemasukan`,
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
      .then((res) => res.json())
      .then((report) => {
        if (report.success) {
          this.reportDataPemasukan = [];
          let id = 1;
          let total = 0;
          const rowLen = report.message.length;
          report.message.map((val, i) => {
            this.reportDataPemasukan.push(
              `<tr style="text-align:center">
                <td>${id}</td>
                <td>${moment(val.tanggal).format('DD MMMM YYYY')}</td>
                <td>${val.jumlah * 50000}</td>
              </tr>`,
            );
            total += val.jumlah * 50000;
            id++;
            if (rowLen === i + 1) {
              this.reportDataPemasukan.push(
                `<tr style="text-align:center">
                  <td colspan="3">Total Pemasukan : ${total}</td>
                </tr>`,
              );
            }
          });
          this.date = date;
          this.dateTo = dateTo;
        } else {
          alert(report.message);
        }
      })
      .catch((error) => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }
}

decorate(Admin, {});
