import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import theme from '../../theme/index';
import {inject, observer} from 'mobx-react';
import utils from '../../utils/index';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {ScrollView} from 'react-native-gesture-handler';
import store from '../../store';

export default observer(CustomDrawerContent);
function CustomDrawerContent(props) {
  const {navigation, state, ...rest} = props;
  const newState = {...state}; //copy from state before applying any filter. do not change original state
  // newState.routes = newState.routes.filter(item => item.name !== 'Logins'); //replace "Login' with your route name

  const onClick = c => {
    if (c == 'logout') {
      //   Logout();
    }

    if (c == 'rate') {
      //   props.navigation.closeDrawer();
    }
  };

  const Login = () => {
    navigation.closeDrawer();
    store.General.setisSheetOpen(true);
  };

  const renderSection1 = () => {
    return (
      <View style={styles.Section1}>
        <TouchableOpacity activeOpacity={0.7} onPress={Login}>
          <Text style={styles.Section1Text}>Log in / Create account</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSection2 = () => {
    return (
      <ScrollView>
        <View style={styles.Section2}>
          <DrawerItemList {...props} />
        </View>
      </ScrollView>
    );
  };

  const renderBottom = () => {
    return (
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomContainerText}>Legal</Text>
        <Text style={styles.bottomContainerText}>Version 1.0</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drwaerContentContainer}>
        {renderSection1()}
        {renderSection2()}
      </DrawerContentScrollView>
      {renderBottom()}
    </View>
  );
}

const pH = 15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drwaerContentContainer: {
    flex: 1,
  },
  Section1: {
    width: '100%',
    height: responsiveHeight(27),
    backgroundColor: theme.color.button1,
    paddingHorizontal: pH,
    paddingVertical: 15,
    justifyContent: 'flex-end',
    marginTop: -5,
  },
  Section1Text: {
    fontSize: 15,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontMedium,
  },
  Section2: {
    flex: 1,
    backgroundColor: theme.color.background,
    paddingVertical: 15,
  },

  bottomContainer: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pH,
    paddingVertical: Platform.OS == 'android' ? 10 : theme.window.APPBAR_HEIGHT,
  },
  bottomContainerText: {
    fontSize: 12,
    color: theme.color.subTitle,
    fontFamily: theme.fonts.fontNormal,
  },
});
