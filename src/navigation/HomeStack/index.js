import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import screens from '../../screens/index';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import icon from './styles';
import CustomDrawerContent from './CustomDrawerContent';
import theme from '../../theme';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
// react navigation v5 work dangerouslyGetParent()
// react navigation v6 work getParent()

export default DrawerStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Homes"
      screenOptions={{
        // swipeEnabled: true,
        // unmountOnBlur: true,
        headerShown: false,
        drawerStyle: {
          backgroundColor: theme.color.background,
          width: theme.window.Width - 50,
          height: theme.window.Height,
        },
      }}
      drawerContentOptions={{
        // activeTintColor: 'red',
        // activeBackgroundColor: 'yellow',
        // inactiveTintColor: 'blue',
        // inactiveBackgroundColor: 'white',
        labelStyle: {
          color: 'white',
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Homes"
        component={HomeStack}
        options={icon.homeIcon}
      />
      <Drawer.Screen
        name="Help"
        component={screens.Help}
        options={icon.helpIcon}
      />
      <Drawer.Screen
        name="Terms"
        component={screens.Terms}
        options={icon.tcIcon}
      />
    </Drawer.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        animationEnabled: false,
        headerShown: false,
      }}>
      <Stack.Screen
        name="Home"
        component={screens.Home}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: true,
          });
        }}
      />
      <Stack.Screen
        name="Home2"
        component={screens.Home2}
        options={props => {
          let parent = props.navigation.getParent();
          parent.setOptions({
            swipeEnabled: false,
          });
        }}
      />
      <Stack.Screen name="Home3" component={screens.Home3} />
      <Stack.Screen name="Search" component={screens.Search} />
      <Stack.Screen name="Filter" component={screens.Filter} />
      <Stack.Screen name="Map" component={screens.Map} />
      <Stack.Screen name="CheckoutEmpty" component={screens.CheckoutEmpty} />
      <Stack.Screen
        name="ResturantDetails"
        component={screens.ResturantDetails}
      />
      <Stack.Screen name="Food" component={screens.Food} />
      <Stack.Screen name="Checkout" component={screens.Checkout} />
      {/* <Stack.Screen name="Help" component={screens.Help} /> */}

      {/* <Stack.Screen name="Checkout" component={screens.Checkout} />
      <Stack.Screen name="OrderLocation" component={screens.OrderLocation} />
      <Stack.Screen name="CheckLogin" component={screens.CheckLogin} />
      <Stack.Screen name="Signup" component={screens.Signup} />
      <Stack.Screen name="OTP" component={screens.OTP} />
      <Stack.Screen name="Setting" component={screens.Setting} />
    
      <Stack.Screen name="OrderStack" component={OrderStack} />
      <Stack.Screen name="PromoStack" component={PromoStack} />
      <Stack.Screen name="Login" component={screens.Login} />
      <Stack.Screen name="ChangePassword" component={screens.ChangePassword} />
      <Stack.Screen name="Favourite" component={screens.Favourite} />
      <Stack.Screen
        name="ResturantDetails"
        component={screens.ResturantDetails}
      />

      <Stack.Screen
        name="OrderIndication"
        component={screens.OrderIndication}
      /> */}
    </Stack.Navigator>
  );
};

// const LocStack = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Loc"
//       screenOptions={{animationEnabled: false, headerShown: false}}>
//       <Stack.Screen name="Loc" component={screens.Location} />
//       <Stack.Screen name="Map" component={screens.Map} />
//     </Stack.Navigator>
//   );
// };

// const OrderStack = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Orders"
//       screenOptions={{animationEnabled: false, headerShown: false}}>
//       <Stack.Screen name="Orders" component={screens.Orders} />
//       <Stack.Screen name="OrdersDetails" component={screens.OrdersDetails} />
//     </Stack.Navigator>
//   );
// };

// const PromoStack = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Promo"
//       screenOptions={{animationEnabled: false, headerShown: false}}>
//       <Stack.Screen name="Promo" component={screens.Promo} />
//       <Stack.Screen name="PromoDetails" component={screens.PromoDetails} />
//     </Stack.Navigator>
//   );
// };
