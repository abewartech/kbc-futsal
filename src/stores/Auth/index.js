import {observable, action, decorate} from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';
import socket from '../../utils/SocketApi';

export class Auth {
  isLoading = false;
  btnDisabled = false;

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  login(username, password, navigation) {
    this.btnDisabled = true;
    this.isLoading = true;

    let data = {username, password};
    fetch(
      `${Endpoint.prod}/login`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(user => {
        if (user.success) {
          const {id, username, role, token} = user;
          const newUser = [
            ['username', `${username}`],
            ['role', `${role}`],
            ['token', `${token}`],
            ['id', `${id}`],
          ];
          AsyncStorage.multiSet(newUser, err => {
            if (err) {
              alert(err);
              this.btnDisabled = false;
              this.isLoading = false;
            } else {
              this.btnDisabled = false;
              this.isLoading = false;

              this.rooStore.credentialStore.setUserCredentials(
                id,
                username,
                role,
                token,
              );
              socket.emit('userConnected', {id, role});
              navigation.navigate('Home');
            }
          });
        } else {
          this.btnDisabled = false;
          this.isLoading = false;
          alert(user.message);
        }
      })
      .catch(error => {
        this.btnDisabled = false;
        this.isLoading = false;
        alert(error.toString().split('TypeError: ')[1]);
      });
  }
}

decorate(Auth, {
  isLoading: observable,
  btnDisabled: observable,
});
