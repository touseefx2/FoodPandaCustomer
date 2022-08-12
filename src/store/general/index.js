import {observable, makeObservable, action} from 'mobx';
import {AppState} from 'react-native';
import {persist} from 'mobx-persist';

class general {
  constructor() {
    makeObservable(this);
  }

  @observable AppName = 'FoodPanda';
  @observable isServerError = false;
  @observable Loading = true;
  @observable isInternet = false;
  @persist('object') @observable isGLocation = false;
  @observable isLocation = false;
  @observable appState = AppState.currentState;
  @observable selectedFilter = [];
  @observable isUpdateNeeded = false;
  @persist('object') @observable apiLevel = '';
  @persist('object') @observable appBuildNumber = '';
  @persist('object') @observable appVersionNumber = '';

  @action setisUpdateNeeded = obj => {
    this.isUpdateNeeded = obj;
  };

  @action setselectedFilter = obj => {
    this.selectedFilter = obj;
  };

  @action setisServerError = obj => {
    this.isServerError = obj;
  };

  @action setappBuildNumber = obj => {
    this.appBuildNumber = obj;
  };

  @action setappVersionNumber = obj => {
    this.appVersionNumber = obj;
  };

  @action setLoading = obj => {
    this.Loading = obj;
  };

  @action setInternet = obj => {
    this.isInternet = obj;
  };

  @action setLocation = obj => {
    this.isLocation = obj;
  };

  @action setGLocation = obj => {
    this.isGLocation = obj;
  };

  @action.bound
  setapiLevel(val) {
    this.apiLevel = val;
  }

  @action setappState = obj => {
    this.appState = obj;
  };
}
export const General = new general();
