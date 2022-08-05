import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectivityManager from 'react-native-connectivity-status';

const hydrateStores = async () => {
  const hydrate = create({storage: AsyncStorage});
  await hydrate('General', store.General);
  await hydrate('User', store.User);
  await hydrate('Food', store.Food);
  await hydrate('Orders', store.Orders);
  await hydrate('Promos', store.Promos);
  // await hydrate("notificationmanager", store.NotificationManager);
};

const getToken = async () => {
  let tok = await messaging().getToken();
  store.User.addnotificationToken(tok);
};
Platform.OS === 'android'
  ? PushNotification.configure({
      onRegister: function (token) {
        store.User.addnotificationToken(token.token);
      },
    })
  : getToken();

export default observer(Splash);

function Splash(props) {
  let title = 'Food Delivery';

  useEffect(() => {
    HydarteStore();
    store.User.setrd({
      name: 'Cheezious',
      loc: {
        coords: {latitude: 33.62497365767188, longitude: 72.96931675031028},
        address: 'J Mall, Islamabad',
      },
      // rating: {
      //   average_rating: 4.5,
      //   total_reviews: 555,
      //   details: [
      //     {
      //       user_name: 'Imran Khan',
      //       rate: 3,
      //       comment: 'Taste and quantity were good',
      //       created_at: 'Aug 2, 2022',
      //     },
      //     {
      //       user_name: 'Nawaz Shareef',
      //       rate: 4,
      //       comment:
      //         'Urna libero massa in pulvinar aliquet morbi eu, cursus pulvinar duis molestie at enim euismod vitae ipsum risus tincidunt tellus donec risus',
      //       created_at: 'Aug 1, 2022',
      //     },
      //     {
      //       user_name: 'James Bond',
      //       rate: 3,
      //       comment: '',
      //       created_at: 'Aug 1, 2022',
      //     },
      //   ],
      // },
      opening_times: [
        {day: 'Mon', open: '9 am', close: '4 pm'},
        {day: 'Tue', open: '9 am', close: '5 pm'},
        {day: 'Wed', open: '9 am', close: '7 pm'},
        {day: 'Thu', open: '9 am', close: '4 pm'},
        {day: 'Fri', open: '1 pm', close: '8 pm'},
        {day: 'Sat', open: '', close: ''},
        {day: 'Sun', open: '', close: ''},
      ],
    });
  }, []);

  const isLocation = async () => {
    const locationServicesAvailable =
      await ConnectivityManager.areLocationServicesEnabled();
    store.General.setLocation(locationServicesAvailable);
  };

  const HydarteStore = async () => {
    await hydrateStores();

    checkIsUserLogin();
    if (store.User.location) {
      isLocation();
    }
  };

  const checkIsUserLogin = () => {
    let isLogin = store.User.user !== false ? true : false;
    let timeout = isLogin ? 2000 : 1500;
    if (isLogin) {
      store.User.getAllData('user');
    } else {
      store.User.getAllData('');
    }

    setTimeout(() => {
      store.General.setLoading(false);
    }, timeout);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={theme.color.backgroundColor}
        barStyle={'dark-content'}
      />
      <Image
        style={styles.logo}
        source={require('../../assets/images/logo/img.png')}
      />

      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  );
}
