import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import {styles} from './styles';
import {inject, observer} from 'mobx-react';
import store from '../../store/index';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import {create} from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../../theme';

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
  // hook

  useEffect(() => {
    checking();
  }, []);

  // method

  const hydrateStores = async () => {
    const hydrate = create({storage: AsyncStorage});
    await hydrate('General', store.General);
    await hydrate('User', store.User);
    // await hydrate('Downloads', store.Downloads);
  };

  const checking = async () => {
    await hydrateStores();
    checkIsUserLogin();
  };

  const checkIsUserLogin = () => {
    let isLogin = store.User.user !== false ? true : false;
    let timeout = isLogin ? 1600 : 1200;
    if (isLogin) {
      store.User.getAllData('user');
    } else {
      store.User.getAllData('');
    }

    setTimeout(() => {
      store.General.setLoading(false);
    }, timeout);
  };

  // render
  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={Platform.OS == 'android' ? true : false}
          backgroundColor={
            Platform.OS == 'android' ? 'transparent' : theme.color.button1
          }
          barStyle={Platform.OS == 'android' ? 'light-content' : 'dark-content'}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}

      <Image
        style={styles.logo}
        source={require('../../assets/images/logo/img.png')}
      />

      <Text style={styles.title1}>{store.General.AppName}</Text>
    </SafeAreaView>
  );
}
