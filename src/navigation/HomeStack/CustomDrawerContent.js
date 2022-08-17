import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import theme from '../../theme/index';
import {inject, observer} from 'mobx-react';
import utils from '../../utils/index';

export default observer(CustomDrawerContent);
function CustomDrawerContent(props) {
  const {state, ...rest} = props;
  const newState = {...state}; //copy from state before applying any filter. do not change original state
  //   newState.routes = newState.routes.filter(item => item.name !== 'Homes'); //replace "Login' with your route name

  const onClick = c => {
    if (c == 'logout') {
      //   Logout();
    }

    if (c == 'rate') {
      //   props.navigation.closeDrawer();
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          backgroundColor: theme.color.button1,
          padding: 15,
        }}
        showsVerticalScrollIndicator={false}>
        <Text>asas</Text>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* <View style={{height: hp('94%')}}>
        <DrawerContentScrollView
          showsVerticalScrollIndicator={false}
          style={{padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {(!user.profile_image || user.profile_image == '') && (
              <utils.vectorIcon.FontAwesome
                name="user-circle"
                color="white"
                size={90}
              />
            )}
            {user.profile_image && user.profile_image !== '' && (
              <View
                style={{
                  width: 90,
                  height: 90,
                  borderColor: 'white',
                  borderRadius: 45,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  onLoad={() => {
                    setimgLoad(true);
                  }}
                  style={{width: 89, height: 89, borderRadius: 44.5}}
                  source={{uri: user.profile_image}}
                />
                {imgLoad == false && (
                  <ActivityIndicator
                    size={19}
                    color="white"
                    style={{top: 35, position: 'absolute'}}
                  />
                )}
              </View>
            )}

            <View style={{width: '63%', marginLeft: 7}}>
              <theme.Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 18,
                  fontFamily: theme.fonts.fontMedium,
                  textTransform: 'capitalize',
                  lineHeight: 28,
                  color: 'white',
                }}>
                {user.fullname}
              </theme.Text>
              <theme.Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 16,
                  color: theme.color.mainPlaceholderColor,
                  textTransform: 'capitalize',
                  lineHeight: 26,
                }}>
                {carnum}
              </theme.Text>
            </View>
          </View>

          <Text
            style={{
              fontSize: 12,
              color: 'white',
              marginLeft: 15,
              marginTop: '12%',
            }}>
            DASHBOARD
          </Text>

          <View style={{marginTop: '6%'}}>
            <View
              style={{
                width: '90%',
                height: 0.5,
                backgroundColor: 'white',
                alignSelf: 'center',
                marginBottom: 10,
              }}
            />

            <DrawerItemList state={newState} {...rest} />

            <View
              style={{
                width: '90%',
                height: 0.5,
                backgroundColor: 'white',
                marginTop: '6%',
                marginBottom: 10,
                alignSelf: 'center',
              }}
            />

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                onClick('rate');
              }}>
              <Image
                style={{width: 22, height: 22}}
                resizeMode="contain"
                source={require('../../assets/drawer_items_icon/star.png')}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 14,
                  color: 'white',
                  marginLeft: 30,
                  lineHeight: 20,
                }}>
                Rate the app
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerItem, {marginBottom: 10}]}
              onPress={() => {
                onClick('logout');
              }}>
              <Image
                style={{width: 22, height: 22}}
                resizeMode="contain"
                source={require('../../assets/drawer_items_icon/exit.png')}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 14,
                  color: 'white',
                  marginLeft: 30,
                  lineHeight: 20,
                }}>
                Sign out
              </Text>
            </TouchableOpacity>
          </View>
        </DrawerContentScrollView>
      </View>

      <View
        style={{
          height: hp('6%'),
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Text style={{fontSize: 12, color: 'white', marginLeft: 15}}>
            Legal
          </Text>
          <Text style={{fontSize: 12, color: 'white', marginLeft: 15}}>
            Version 1.0
          </Text>
        </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white',
  },
  name: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  drawerItem: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
