import {Credentials} from './UserCredential';
import {Auth} from './Auth';
import {Model} from './Model';
import {Cavity} from './Cavity';
import {Project} from './Project';
import {Line} from './Line';
import {Activity} from './Activity';

export class RootStore {
  credentialStore = new Credentials(this);
  authStore = new Auth(this);
  modelStore = new Model(this);
  cavityStore = new Cavity(this);
  lineStore = new Line(this);
  projectStore = new Project(this);
  activityStore = new Activity(this);
}
