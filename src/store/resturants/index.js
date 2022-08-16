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

  @observable Resturants = false;
  @observable filter = [];

  @persist('object') @observable isSetLocOnce = false;

  @persist('object') @observable data = [];

  @observable dataLoader = false;

  @action setResturants = obj => {
    this.Resturants = obj;
  };

  @action setisLocOnce = obj => {
    this.isSetLocOnce = obj;
  };

  @action setdatLaoader = obj => {
    this.dataLoader = obj;
  };

  @action setData = obj => {
    this.data = obj;
  };

  @action setfilter = obj => {
    this.filter = obj;
  };

  @action.bound
  getData(loc, type) {
    this.setdatLaoader(true);

    setTimeout(() => {
      let arr = [
        {
          name: 'BroadWay Pizza',
          type: 'Pizza',
          promotions: true,
          loc: {
            coords: {latitude: 33.62497365767188, longitude: 72.96931675031028},
            address: 'D Chowk, Islamabad',
          },
          rating: {
            average_rating: 4.5,
            total_reviews: 555,
            details: [
              {
                user_name: 'Imran Khan',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz Shareef',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          order_type: 'delivery',
          deals: '',
          image: require('../../assets/images/pizza/img.jpeg'),
          delivery_charges: 80,
        },
        {
          name: 'AB Cuisine',
          type: 'Fast Food',
          promotions: true,
          image: require('../../assets/images/burger/img.jpeg'),
          loc: {
            coords: {latitude: 33.64581985471614, longitude: 72.97007398160882},
            address: 'J Mall, Islamabad',
          },
          rating: {
            average_rating: 3.5,
            total_reviews: 455,
            details: [
              {
                user_name: 'Imran Khan',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz Shareef',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          order_type: 'delivery',
          deals: 'Summer deals & discounts',
          delivery_charges: 50,
        },
        {
          name: 'KFC',
          type: 'Fast Food',
          promotions: false,
          image: require('../../assets/images/kfc/img.jpeg'),

          loc: {
            coords: {latitude: 33.69460562193796, longitude: 73.01318278125936},
            address: 'KFC F10, Islamabad',
          },
          rating: {
            average_rating: 4.7,
            total_reviews: 6000,
            details: [
              {
                user_name: 'Imran Khan',
                rate: 3,
                comment: 'Taste and quantity were good',
                created_at: 'Aug 2, 2022',
              },
              {
                user_name: 'Nawaz Shareef',
                rate: 4,
                comment:
                  'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
                created_at: 'Aug 1, 2022',
              },
              {
                user_name: 'James Bond',
                rate: 3,
                comment: '',
                created_at: 'Aug 1, 2022',
              },
            ],
          },
          opening_times: [
            {day: 'Mon', open: '9 am', close: '4 pm'},
            {day: 'Tue', open: '9 am', close: '5 pm'},
            {day: 'Wed', open: '9 am', close: '7 pm'},
            {day: 'Thu', open: '9 am', close: '4 pm'},
            {day: 'Fri', open: '1 pm', close: '8 pm'},
            {day: 'Sat', open: '', close: ''},
            {day: 'Sun', open: '', close: ''},
          ],
          order_type: 'delivery',

          delivery_charges: 200,
        },
      ];
      this.setResturants(arr);
    }, 2500);

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
