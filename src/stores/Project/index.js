import {observable, action, decorate} from 'mobx';
import fetch from 'react-native-fetch-polyfill';
import Endpoint from '../../utils/Endpoint';

export class Project {
  allProject = [];
  dataToSubmit = {};
  selectedProject = [];

  constructor(rooStore) {
    this.rooStore = rooStore;
  }

  getProject(token) {
    fetch(
      `${Endpoint.prod}/getallprojects`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.allProject = res.message;
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  getProjectByModelCavity(token, params) {
    fetch(
      `${Endpoint.prod}/getproject/${params}`,
      {
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      },
      {timeout: Endpoint.timeout},
    )
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          this.selectedProject = res.message;
        } else {
          alert(res.message);
        }
      })
      .catch(error => {
        alert(error.toString().split('TypeError: ')[1]);
      });
  }

  setDataToSubmit(data) {
    this.dataToSubmit = data;
  }
}

decorate(Project, {
  getProject: action,
  allProject: observable,
  dataToSubmit: observable,
  getProjectByModelCavity: action,
  selectedProject: observable,
});
