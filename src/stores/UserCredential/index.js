import {observable, action, decorate} from 'mobx';

export class Credentials {
  id = null;
  username = null;
  role = null;
  token = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setUserCredentials(id, username, role, token) {
    this.id = id;
    this.username = username;
    this.role = +role;
    this.token = token;
  }

  resetUserCredentials() {
    this.id = null;
    this.username = null;
    this.role = null;
    this.token = null;
  }
}

decorate(Credentials, {
  id: observable,
  username: observable,
  role: observable,
  token: observable,
  resetUserCredentials: action,
});
