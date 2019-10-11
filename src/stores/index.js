import {Credentials} from './UserCredential';
import {Auth} from './Auth';
import {Home} from './Home';

export class RootStore {
  credentialStore = new Credentials(this);
  authStore = new Auth(this);
  homeStore = new Home(this);
}
