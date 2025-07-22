import {observable, decorate} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Auth {
  isLoading = false;
  btnDisabled = false;

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  login(email, password, navigation) {
    this.btnDisabled = true;
    this.isLoading = true;

    let data = {email, password};
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
      .then((res) => res.json())
      .then((user) => {
        if (user.success) {
          const {id, email, role, token, name} = user;
          const newUser = [
            ['email', `${email}`],
            ['role', `${role}`],
            ['token', `${token}`],
            ['id', `${id}`],
            ['name', `${name}`],
          ];
          AsyncStorage.multiSet(newUser, (err) => {
            if (err) {
              alert(err);
              this.btnDisabled = false;
              this.isLoading = false;
            } else {
              this.btnDisabled = false;
              this.isLoading = false;

              this.rooStore.credentialStore.setUserCredentials(
                id,
                email,
                role,
                token,
                name,
              );
              if (role == 1) {
                navigation.navigate('Home');
              } else {
                navigation.navigate('Admin');
              }
            }
          });
        } else {
          this.btnDisabled = false;
          this.isLoading = false;
          alert(user.message);
        }
      })
      .catch((error) => {
        this.btnDisabled = false;
        this.isLoading = false;
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  register(name, email, password, passwordMatch, navigation) {
    this.btnDisabled = true;
    this.isLoading = true;
    const role = 1;

    let data = {name, email, password, passwordMatch, role};
    fetch(
      `${Endpoint.prod}/adduser`,
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
      .then((res) => res.json())
      .then((user) => {
        if (user.success) {
          this.login(email, password, navigation);
          this.btnDisabled = false;
          this.isLoading = false;
        } else {
          this.btnDisabled = false;
          this.isLoading = false;
          alert(user.message);
        }
      })
      .catch((error) => {
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
