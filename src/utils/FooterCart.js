import React, {useEffect} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Platform} from 'react-native';
import theme from '../theme/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import utils from '.';

import store from '../store/index';
import {observer} from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';

export default observer(FooterCart);
function FooterCart(props) {
  let cart = store.User.cart;
  let totalItems = cart.totalitems;
  let totalBill = cart.totalbill;
  let nav = props.nav;

  let user = store.User.user;

  const onPress = () => {
    nav.navigate('Checkout', {openSheet: props.openSheet});
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={Platform.OS == 'android' ? styles.foodCard : styles.foodCardios}>
        <View style={styles.foodCardLinear}>
          <View style={{width: '24%'}}>
            <View style={styles.section1}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.t1}>
                {totalItems <= 99 ? totalItems : '99+'}
              </Text>
            </View>
          </View>

          <View style={styles.section2}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.t4}>
              View your cart
            </Text>
          </View>

          <View style={styles.section3}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.t4}>
              Rs. {totalBill}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    width: '100%',
    elevation: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  foodCardios: {
    width: '100%',
    elevation: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 15,
    paddingVertical: theme.window.APPBAR_HEIGHT,
    shadowColor: '#000',

    shadowOffset: {width: 0, height: 1},

    shadowOpacity: 0.6,

    shadowRadius: 1,
  },
  foodCardLinear: {
    height: responsiveHeight(6),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: theme.color.button1,
    borderRadius: 10,
  },

  section11: {
    borderColor: theme.color.background,
    width: 60,
    height: 30,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section2: {
    width: '40%',
    // backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  section3: {
    width: '32%',
    // backgroundColor: 'red',
    alignItems: 'flex-end',
  },
  section1: {
    borderColor: theme.color.background,
    width: 30,
    height: 30,
    borderWidth: 1.5,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  t1: {
    fontSize: 12,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 17,
  },
  t2: {
    fontSize: 16,
    color: theme.color.footerCartText,
    fontFamily: theme.fonts.fontMedium,
    lineHeight: 20,
  },
  t3: {
    fontSize: 12,
    color: theme.color.footerCartText,
    fontFamily: theme.fonts.fontNormal,
    lineHeight: 16,
  },
  t4: {
    fontSize: 14,
    color: theme.color.buttonText,
    fontFamily: theme.fonts.fontBold,
    lineHeight: 20,
  },
});
