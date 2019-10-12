import {observable, action, decorate} from 'mobx';

export class Credentials {
  id = null;
  email = null;
  role = null;
  token = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  setUserCredentials(id, email, role, token) {
    this.id = id;
    this.email = email;
    this.role = +role;
    this.token = token;
  }

  resetUserCredentials() {
    this.id = null;
    this.email = null;
    this.role = null;
    this.token = null;
  }
}

decorate(Credentials, {
  id: observable,
  email: observable,
  role: observable,
  token: observable,
  resetUserCredentials: action,
});
