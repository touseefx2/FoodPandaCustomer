import {observable, makeObservable, action} from 'mobx';
import {persist} from 'mobx-persist';
import store from '../index';
import NetInfo from '@react-native-community/netinfo';
import db from '../../database/index';
import {Alert} from 'react-native';

class resturants {
  constructor() {
    makeObservable(this);
  }

  @persist('object') @observable isSetLocOnce = false;

  @persist('object') @observable data = [];

  @observable loader = false;

  @action setisLocOnce = obj => {
    this.isSetLocOnce = obj;
  };

  @action setloader = obj => {
    this.loader = obj;
  };

  @action setData = obj => {
    this.data = obj;
  };

  @action.bound
  getData(loc, setLoader) {
    // setLoader(true);
    // setTimeout(() => {
    //   setLoader(false);
    //   store.Resturants.setisLocOnce(true);
    // }, 2000);
    // db.hitApi(db.apis.GET_FOOD_CATEGORY + city._id, 'get', null, null)
    //   ?.then((resp: any) => {
    //     this.setloader(false);
    //     console.log(
    //       `response  ${db.apis.GET_FOOD_CATEGORY} : `,
    //       resp.data.data,
    //     );
    //   })
    //   .catch(err => {
    //     this.setloader(false);
    //     let msg = err.response.data.message || err.response.status;
    //     console.log(`Error in ${db.apis.GET_FOOD_CATEGORY} : `, msg);
    //     if (msg == 503 || msg == 500) {
    //       store.General.setisServerError(true);
    //       return;
    //     }
    //     if (msg == 'No records found') {
    //       this.setData([]);
    //       return;
    //     }
    //     Alert.alert('', msg.toString());
    //   });
  }
}

export const Resturants = new resturants();
