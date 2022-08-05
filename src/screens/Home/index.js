import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  Dimensions,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import DynamicTabView from 'react-native-dynamic-tab-view';
import ImageSlider from 'react-native-image-slider';
import FastImage from 'react-native-fast-image';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-easy-toast';
import MaskedView from '@react-native-community/masked-view';
import Svg, {Path} from 'react-native-svg';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator} from 'react-native-paper';

export default observer(Home);
function Home(props) {
  const rbSheet = useRef(null);
  // const gapikey = 'AIzaSyAJeMjKbTTRvoZJe0YoJc48VhaqbtoTmug';
  const gapikey = 'AIzaSyC75RWT0q9xkASq2YhX2vGi1R-e_p2pnWU';
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  const windowWidth = theme.window.Width;
  const imageAspectWidth = 375;
  const imageAspectHeight = 332;
  const curveAdjustment = 10;
  const maskHeight = responsiveHeight(28);
  const scaleFactor = imageAspectWidth / imageAspectHeight;
  const scaledHeight = scaleFactor * maskHeight;
  const controlPointX = windowWidth / 2.0;
  const controlPointY = scaledHeight + curveAdjustment;
  const curveCenterPointY = (controlPointY - maskHeight) / 2;

  let city = store.User.location.city;
  let cart = store.User.cart;
  let area = store.User.location.area;
  let sliderImages = store.Food.sliderImages;
  let food = store.Food.food;
  let loader = store.Food.loader;
  let load = store.User.loader;
  let internet = store.General.isInternet;
  let getDataOnce = store.Food.getDataOnce;

  let cl = store.User.cl;

  let islOCATION = store.General.isLocation;

  let contact = store.Food.sliderImages;

  let tagLine = contact.tagLine;

  const [resturantName, setresturantName] = useState('Cheezious');

  const [distance, setdistance] = useState(0);

  const [rs, setrs] = useState('$$');

  let resturant = store.User.rd;

  const [deliverTime, setdeliverTime] = useState(
    contact.estimatedDeliveryTime || '0',
  );

  useEffect(() => {
    setdeliverTime(contact.estimatedDeliveryTime || '0');
  }, [contact]);

  useEffect(() => {
    Geocoder.init(gapikey, {language: 'en'});
  }, []);

  // let isaddVarModal = store.User.isAddModal;
  // let issubVarModal = store.User.isSubModal;
  // let isVariationDtail = store.User.isVarModal;
  // let isLoginModalchlk = store.User.isChkLoginModal;

  const toast = useRef(null);
  const toastduration = 700;

  const [isReferesh, setisReferesh] = useState(true);

  const [loadd, setloadd] = useState(false);

  const [img, setImg] = useState(
    sliderImages.appCover ? sliderImages.appCover : [],
  );
  const [foodCategory, setfoodCategory] = useState(false);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      subscription.remove();
    };
  }, []);

  function handleBackButtonClick() {
    if (!props.navigation.isFocused()) {
      return false;
    }

    Alert.alert('', 'Are you sure you want to exit the app?', [
      {
        text: 'No',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  }

  useEffect(() => {
    if (isReferesh && !getDataOnce) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          setfoodCategory(false);
          // setImg([]);
          store.Food.getSliderImages(city);
          let isLogin = store.User.user !== false ? true : false;
          if (isLogin) {
            store.User.getAllData('user');
          } else {
            store.User.getAllData('');
          }
        }
      });
    }
  }, [internet, isReferesh, getDataOnce]);

  useEffect(() => {
    if (islOCATION) {
      getCurrentLocationOne();
    }
    if (!islOCATION) {
      requestPermissions();
    }
  }, [islOCATION]);

  const fetchDistanceBetweenPointsOnline = (p1, p2) => {
    console.log('fetchdsistancematric p1 cl: ', p1);
    console.log('fetchdsistancematric p2 rl: ', p2);
    var urlToFetchDistance =
      'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric?mode=driving&origins=' +
      p1.latitude +
      ',' +
      p1.longitude +
      '&destinations=' +
      p2.latitude +
      '%2C' +
      p2.longitude +
      '&key=' +
      gapikey;

    try {
      fetch(urlToFetchDistance)
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res) {
            console.log('fetchdsistancematric res true ', res);
            if (res?.rows.length > 0) {
              let distanceInMeter = res.rows[0].elements[0].distance.value; //in meter
              let distanceInKm = distanceInMeter / 1000; //in meter to km

              setdistance(distanceInKm);
            }

            return;
          }
        })
        .catch(error => {
          // utils.AlertMessage(
          //   "fetchdsistancematric api error ",
          //   "Network request failed"
          // );
          console.log('fetchdsistancematric catch error : ', error);
          return;
        });
    } catch (error) {
      console.log('fetchdsistancematric catch error ', error);
    }
  };

  useEffect(() => {
    if (cl) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          //  calculate distance btw two points
          let crntloctn = cl.coords;
          let resturantloc = resturant.loc.coords;
          fetchDistanceBetweenPointsOnline(crntloctn, resturantloc);
        }
      });
    }
  }, [store.User.cl, internet]);

  const getCurrentLocationOne = c => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async position => {
        const cl = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        console.log('get c loc one res true');

        const loc = {
          city_name: '',
          coords: cl,
        };

        store.User.setcl(loc);

        Geocoder.from({
          latitude: cl.latitude,
          longitude: cl.longitude,
        })
          .then(json => {
            let results = json.results;

            console.log('geocoder json data true : ');
            let cityName = '';
            if (results[0]) {
              var add = results[0].formatted_address;
              var value = add.split(',');
              let count = value.length;
              let country = value[count - 1];
              let state = value[count - 2];
              let city = value[count - 3];
              cityName = city;
            } else {
              console.log(' geocoder json  res : ', 'address not found');
            }

            const locc = {
              city_name: cityName,
              coords: cl,
            };
            store.User.setcl(locc);

            return;
          })
          .catch(error => {
            // if (error.code == 4) {
            //   Alert.alert(
            //     '',
            //     'Please enable billing account on your google map api key',
            //   );
            // }
            console.warn('geocoder error : ', error);
            return;
          });
      },
      error => {
        if (error.code == 3) {
          if (!store.User.cl) {
            getCurrentLocationOne(c);
          }
        }

        if (error.code == 1) {
          // locationEnabler()
        }

        console.log('get crnt loc one error : ', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const hasPermissionIOS = async () => {
    console.log('In request iOS permissions');
    const status = await Geolocation.requestAuthorization('whenInUse');
    console.log(status);
    if (status === 'granted') {
      store.General.setLocation(true);

      return true;
    }

    store.General.setLocation(false);
    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow Karblock to determine your location.`,
        '',
        [
          {
            text: 'Go to Settings',
            onPress: () => {
              openSetting();
            },
          },
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };

    return false;
  };

  const androidLocationEnablerDialog = () => {
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        store.General.setLocation(true);
      })
      .catch(err => {
        toast?.current?.show('Please turn on location');
        console.log('location enabler popup error : ', err);
      });
  };

  const hasPermissionAndroid = async () => {
    let g = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('permission result : ', g);

    if (g === PermissionsAndroid.RESULTS.GRANTED) {
      androidLocationEnablerDialog();
      return;
    }

    store.General.setLocation(false);
    let msg = 'permisiion location';
    if (g === 'denied') {
      msg = 'Please allow permision to use location';
    }

    if (g === 'never_ask_again') {
      msg =
        'Please allow permision to use location in  app setting in device allow location permission to continue';
    }

    Alert.alert(``, msg, [
      {
        text: 'Go to Settings',
        onPress: () => {
          openSetting();
        },
      },
      {text: "Don't Use Location", onPress: () => {}},
    ]);

    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };

    return;
  };

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      console.log('Requesting iOS Permissions');
      hasPermissionIOS();
      return;
    }
    if (Platform.OS === 'android') {
      console.log('Requesting Android Permissions');
      hasPermissionAndroid();
    }
  }

  useEffect(() => {
    let arr = [];
    if (food.length > 0) {
      setloadd(true);
      food.map((e, i, a) => {
        let title = e.name;
        let key = e._id;
        let products = e.products;
        let branch = e.branch;

        const obj = {
          title: title,
          key: key,
          data: products,
          branch: branch,
        };
        arr.push(obj);
      });
    }
    setTimeout(() => {
      setloadd(false);
    }, 100);
    setfoodCategory(arr);
  }, [food]);

  useEffect(() => {
    setImg(sliderImages.appCover ? sliderImages.appCover : []);
  }, [sliderImages]);

  const renderTab = e => {
    let d = e;

    if (d.name != 'empty') {
      return (
        <utils.FoodCard
          data={d}
          nav={props.navigation}
          call="home"
          toast={toast}
          screen=""
        />
      );
    } else {
      return (
        <View style={styles.emptySECTION}>
          <Image
            style={styles.emptyImg}
            source={require('../../assets/images/empty/img.png')}
          />
          <Text style={styles.emptyText}>Sorry!</Text>
          <Text style={[styles.emptyText, {marginTop: -5}]}>
            Currently no items are available here
          </Text>
        </View>
      );
    }
  };

  const onChangeTab = e => {
    console.log('selected tab : ', e);
  };

  const gotoChangeLocation = () => {
    store.User.setcl(false);
    setisReferesh(false);
    store.Food.setgetDataOnce(false);
    props.navigation.navigate('Location', {
      screen: 'home',
      setisReferesh: c => setisReferesh(c),
    });
  };

  const gotoSearch = () => {
    props.navigation.navigate('Search', {data: foodCategory});
  };

  const gotoHelp = () => {
    props.navigation.navigate('Help');
  };

  const gotoSetting = () => {
    console.log('user : ', store.User.user);
    if (!store.User.user) {
      rbSheet?.current?.open();
      // props.navigation.navigate('CheckLogin', {screen: 'home'});
      return;
    }
    props.navigation.navigate('Setting');
  };

  useEffect(() => {
    if (cart.data.length <= 0) {
      cart.totalbill = 0;
      cart.totalitems = 0;
    }
    if (cart.data.length > 0) {
      let tb = 0;
      let ti = 0;

      cart.data.map((e, i, a) => {
        tb = tb + parseFloat(e.bill);
        ti = ti + parseFloat(e.quantity);
      });

      cart.totalbill = tb;
      cart.totalitems = ti;
    }
  }, [cart]);

  const renderHeader = () => {
    return (
      <View
        style={[
          styles.header,
          {
            marginTop:
              internet && tagLine == ''
                ? theme.window.STATUSBAR_HEIGHT + 10
                : 10,
          },
        ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={gotoChangeLocation}
          style={[styles.icon, {marginLeft: 0}]}>
          <utils.vectorIcon.Entypo
            name="chevron-down"
            color={theme.color.button1}
            size={22}
          />
        </TouchableOpacity>

        <View style={styles.headerSection2}>
          <TouchableOpacity
            onPress={gotoSearch}
            activeOpacity={0.5}
            style={styles.icon}>
            <utils.vectorIcon.AntDesign
              name="search1"
              color={theme.color.button1}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={gotoHelp}
            activeOpacity={0.5}
            style={styles.icon}>
            <utils.vectorIcon.Feather
              name="help-circle"
              color={theme.color.button1}
              size={20}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={gotoSetting}
            activeOpacity={0.5}
            style={styles.icon}>
            <utils.vectorIcon.AntDesign
              name="user"
              color={theme.color.button1}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderImageSliderBox = () => {
    return (
      <MaskedView
        style={[
          styles.mask,
          {
            height: controlPointY - curveCenterPointY,
          },
        ]}
        maskElement={
          <Svg height="100%" width="100%">
            <Path
              d={`M0 0 L${windowWidth} 0 L${windowWidth} ${maskHeight} Q${controlPointX} ${controlPointY} 0 ${maskHeight} Z`}
              fill={'#fff'}
            />
          </Svg>
        }>
        <ImageSlider
          autoPlayWithInterval={2000}
          images={img}
          style={{
            backgroundColor: theme.color.background,
            elevation: 5,
          }}
          customSlide={({index, item, style, width}) => (
            <TouchableOpacity
              style={style}
              activeOpacity={0.7}
              disabled
              key={index}>
              <FastImage
                style={{
                  flex: 1,
                  resizeMode: 'stretch',
                }}
                source={{
                  uri: item,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>
          )}
        />
        {renderHeader()}
      </MaskedView>
    );
  };

  const renderTitleSection = () => {
    const renderLine = () => {
      return (
        <View
          style={{
            width: 1,
            height: '60%',
            backgroundColor: theme.color.subTitle,
            marginHorizontal: 12,
          }}
        />
      );
    };

    const goToResturantDetails = () => {
      props.navigation.navigate('ResturantDetails');
    };

    // const navigatetoGoogleMaps = () => {
    //  let label =  restureant.name

    // let dest = restureant.loc.coords

    //   const scheme = Platform.select({
    //     ios: 'maps:0,0?q=',
    //     android:
    //       'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=',
    //   });
    //   let latLng = `${dest.latitude},${dest.longitude}`;

    //   const url = Platform.select({
    //     ios: `https://www.google.com/maps/?api=1&query=${label}&center=${latLng}`,
    //     android: `${scheme}${latLng}`,
    //   });

    //   Linking.canOpenURL(url)
    //     .then(supported => {
    //       console.log('start google map support', supported);
    //       return Linking.openURL(url);
    //       // if (supported) {
    //       //   let browser_url =
    //       //     "https://www.google.de/maps/@" +
    //       //     dest.latitude +
    //       //     "," +
    //       //     dest.longitude +
    //       //     "?q=" +
    //       //     label;
    //       //   return Linking.openURL(browser_url);
    //       // } else {
    //       //   return Linking.openURL(url);
    //       // }
    //     })
    //     .catch(err => {
    //       console.log('error open google map', err);
    //       Alert.alert('', err);
    //     });
    // };

    return (
      <View
        style={{
          paddingHorizontal: 12,
          marginTop: 10,
          marginBottom: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{width: '78%'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 18,
                fontFamily: theme.fonts.fontBold,
                color: theme.color.title,
                textTransform: 'capitalize',
                lineHeight: 22,
              }}>
              {resturant.name}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={goToResturantDetails}
            style={{
              width: '19%',
              alignItems: 'flex-end',
            }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 13,
                fontFamily: theme.fonts.fontBold,
                color: theme.color.button1,
              }}>
              More info
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.fontBold,
              color: theme.color.subTitle,
            }}>
            {parseFloat(distance).toFixed(1)} km
          </Text>
          {renderLine()}
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.fontBold,
              color: theme.color.subTitle,
            }}>
            {rs}
          </Text>
          {renderLine()}
          <Text
            style={{
              fontSize: 12,
              fontFamily: theme.fonts.fontBold,
              color: theme.color.subTitle,
            }}>
            {deliverTime} min delivery
          </Text>
          {/* {renderLine()}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <utils.vectorIcon.Entypo
              name="star"
              color={theme.color.rate}
              size={15}
            />
            <Text
              style={{
                fontSize: 12,
                fontFamily: theme.fonts.fontBold,
                color: theme.color.title,
                marginLeft: 3,
              }}>
              {resturant.rating.average_rating}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontFamily: theme.fonts.fontBold,
                color: theme.color.subTitle,
                marginLeft: 3,
              }}>
              (
              {resturant.rating.total_reviews <= 500
                ? resturant.rating.total_reviews
                : '500+'}
              )
            </Text>
          </View> */}
        </View>
      </View>
    );
  };

  // console.log('cart : ', cart);
  // console.log('cart data : ', cart.data);
  // console.log('cart data variant : ', cart.data[0]?.variants);
  // console.log(' selected product : ', store.Food.selectedProduct);
  // console.log(' selected var detial : ', store.Food.selectedvariationDetail);
  // console.log('vartns  : ', store.Food.variations);

  const renderBottomSheet = () => {
    const Login = () => {
      rbSheet?.current?.close();
      props.navigation.navigate('Login', {s: ''});
    };

    const Guest = () => {
      rbSheet?.current?.close();
      props.navigation.goBack();
    };

    const renderLoginButton = () => {
      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Login();
            }}
            style={styles.BottomButton}>
            <Text style={styles.buttonTextBottom}>
              Continue with phone number
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    const renderGuestButton = () => {
      return (
        <>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              Guest();
            }}
            style={styles.BottomButton2}>
            <Text
              style={[styles.buttonTextBottom, {color: theme.color.button1}]}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
        </>
      );
    };

    return (
      <>
        <RBSheet
          ref={rbSheet}
          height={responsiveHeight(35)}
          closeOnPressBack={true}
          openDuration={250}
          screen={''}
          closeOnDragDown={true}
          closeOnPressMask={true}
          KeyboardAvoidingView={true}
          customStyles={{
            wrapper: {
              flex: 1,
              // backgroundColor: 'transparent',
            },
            container: {
              backgroundColor: theme.color.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              elevation: 5,
            },
            draggableIcon: {
              // backgroundColor: theme.color.cartbutton,
            },
          }}>
          <StatusBar
            translucent={false}
            backgroundColor={theme.color.button1}
            barStyle={'light-content'}
          />
          <View
            style={{
              marginHorizontal: 15,
            }}>
            <Text
              style={{
                fontFamily: theme.fonts.fontBold,
                color: theme.color.title,
                fontSize: 18,
              }}>
              Sign up or log in
            </Text>

            <View style={{marginTop: 30}}>
              {renderLoginButton()}

              <Text style={styles.titleText2}>or</Text>
              {renderGuestButton()}
            </View>
          </View>
        </RBSheet>
      </>
    );
  };

  const renderStatusBar = () => {
    if (internet && tagLine == '') {
      return (
        <StatusBar
          translucent={Platform.OS == 'ios' ? false : true}
          backgroundColor={
            Platform.OS == 'ios' ? theme.color.background : 'transparent'
          }
          barStyle={Platform.OS == 'ios' ? 'dark-content' : 'light-content'}
        />
      );
    } else {
      return (
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.background}
          barStyle={'dark-content'}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderStatusBar()}
      {!internet && (
        <utils.InternetMessage
          color={tagLine != '' ? 'red' : theme.color.button1}
        />
      )}
      {tagLine != '' && <utils.TagLine tagLine={tagLine} />}
      {renderBottomSheet()}
      {img.length > 0 && (
        <View>
          {renderImageSliderBox()}
          {renderTitleSection()}
        </View>
      )}
      <utils.Loader load={loader || load} text={loader ? 'Please wait' : ''} />

      {foodCategory != false && !loadd && foodCategory.length > 0 && (
        <>
          <DynamicTabView
            data={foodCategory}
            defaultIndex={0}
            renderTab={renderTab}
            onChangeTab={onChangeTab}
            headerTextStyle={{
              color: theme.color.title,
              fontFamily: theme.fonts.fontMedium,
            }}
            headerBackgroundColor={theme.color.background}
            headerUnderlayColor={theme.color.button1}
            containerStyle={{
              backgroundColor: theme.color.background,
              paddingBottom: cart.data.length > 0 ? responsiveHeight(10) : 0,
              overflow: 'hidden',
            }}
          />
        </>
      )}

      {loadd && (
        <>
          <ActivityIndicator
            size={27}
            color={theme.color.button1}
            style={styles.emptySECTION}
          />
        </>
      )}

      {loader == false && foodCategory.length <= 0 && (
        <View style={styles.emptySECTION2}>
          <Image
            style={styles.emptyImg}
            source={require('../../assets/images/empty/img.png')}
          />
          <Text style={styles.emptyText}>Sorry!</Text>
          <Text style={[styles.emptyText, {marginTop: -5}]}>
            Currently no products are available here
          </Text>
        </View>
      )}

      {cart.data.length > 0 && <utils.FooterCart nav={props.navigation} />}

      <Toast ref={toast} position="bottom" />
    </SafeAreaView>
  );
}
