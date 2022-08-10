import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
  Linking,
  Platform,
  Dimensions,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {styles} from './styles';
import {observer} from 'mobx-react';
import store from '../../store/index';
import utils from '../../utils/index';
import theme from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-easy-toast';
import Geolocation from 'react-native-geolocation-service';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geocoder from 'react-native-geocoding';
import NetInfo from '@react-native-community/netinfo';
import {isPointInPolygon, getCenterOfBounds} from 'geolib';

export default observer(Location);

function Location(props) {
  const window = Dimensions.get('window');
  const {width, height} = window;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA + width / height;

  let screen = props?.route?.params?.screen || '';
  const scrollRef = useRef(null);
  const toast = useRef(null);
  const toastduration = 400;

  const [isCenter, setisCenter] = useState('nill'); //for city
  const [isCenter2, setisCenter2] = useState('nill'); //for area
  const [coordCenter, setcoordCenter] = useState('nill');

  const [isDropDownCity, setisDropDownCity] = useState(false);
  const [isDropDownArea, setisDropDownArea] = useState(false);

  const [loc, setloc] = useState(false);

  const [city, setcity] = useState([]);
  const [area, setarea] = useState([]);

  const [cityList, setcityList] = useState([]);
  const [areaList, setareaList] = useState([]); //for drop down relted to city

  const [loader, setloader] = useState(false); //for drop down relted to city

  let title = 'Food Delivery';
  let title2 = 'Please select your city and area';
  let internet = store.General.isInternet;
  let isGetAllDatainSplash = store.User.isGetAllDatainSplash;
  let CityAreaData = store.User.CityAreaData;
  let isLocation = store.General.isLocation;
  let polygons = store.User.polygons;

  let cl = store.User.cl;

  console.log('is Loc :  ', isLocation);

  useEffect(() => {
    if (coordCenter) {
      console.log('crdscenter : ', coordCenter);
      const obj = {
        city: city,
        area: area,
        coords: coordCenter,
      };
      setloc(obj);
      // setcoordCenter('nill');
    }
  }, [coordCenter]);

  useEffect(() => {
    if (isLocation && internet && polygons.length > 0 && !cl) {
      getCurrentLocationOne();
    }
  }, [isLocation, internet, polygons, cl]);

  useEffect(() => {
    if (internet && !isGetAllDatainSplash) {
      onRefresh();
    }
    if (isGetAllDatainSplash) {
      setTimeout(() => {
        store.User.setisGetAllDatainSplash(false);
      }, 3000);
    }
  }, [internet]);

  useEffect(() => {
    if (CityAreaData.length > 0) {
      let arr = [];
      let arr2 = [];
      CityAreaData.map((e, i, a) => {
        if (e.city) {
          arr.push(e.city);
        }
        let areas = e.areas || [];
        if (areas.length > 0) {
          areas.map((ee, i, a) => {
            let dd = [];
            let d = ee.latlngs;

            // console.log('area : ', ee);
            // console.log('lt lng : ', d);

            if (d.length > 0) {
              d.map((c, i, a) => {
                dd.push({
                  latitude: parseFloat(c.lat),
                  longitude: parseFloat(c.lng),
                });
              });
              const obj = {
                _id: ee._id,
                area: ee,
                latlngs: dd,
                city: e.city,
              };
              console.log('obj : ', obj);
              arr2.push(obj);
            }
          });
        }
      });
      setcityList(arr);
      store.User.addPolygons(arr2);
    }
  }, [CityAreaData]);

  useEffect(() => {
    if (city.length !== 0 && isCenter != 'nill') {
      if (CityAreaData.length > 0) {
        let arr = [];
        arr = CityAreaData.filter(function (item) {
          if (item.city) {
            return item.city._id === city._id;
          }
        });
        let al = arr[0].areas;
        setareaList(al);

        if (isCenter) {
          if (al[0].latlngs.length > 0) {
            let dd = [];
            al[0].latlngs.map((e, i, a) => {
              dd.push({
                latitude: parseFloat(e.lat),
                longitude: parseFloat(e.lng),
              });
            });
            let coords = [];
            if (dd.length > 0) {
              coords = getCenterOfBounds(dd);
            }

            if (coords) {
              let pnt = {
                lat: coords.latitude,
                long: coords.longitude,
              };
              setcoordCenter(pnt);
            }
          }
        }
      }
    }
  }, [city, isCenter]);

  useEffect(() => {
    if (area.length !== 0 && isCenter2 != 'nill') {
      if (polygons.length > 0) {
        let arr = [];
        arr = polygons.filter(function (item) {
          return item._id === area._id;
        });
        let ltlngs = arr[0].latlngs;
        let dd = [];
        if (ltlngs.length > 0) {
          ltlngs.map((e, i, a) => {
            console.log('eeeee : ', e);
            dd.push({
              latitude: parseFloat(e.latitude),
              longitude: parseFloat(e.longitude),
            });
          });
        }
        console.log('dd : ', dd);
        if (isCenter2) {
          let coords = [];
          if (dd.length > 0) {
            try {
              coords = getCenterOfBounds(dd);
            } catch (error) {
              console.log('getCenterOfBounds  ::::  : ', error);
            }
          }

          console.log('coords ::::  : ', coords);

          if (coords) {
            let pnt = {
              lat: coords.latitude,
              long: coords.longitude,
            };
            setcoordCenter(pnt);
          }
        }
      }
    }
  }, [area, isCenter2]);

  const ISPointInPolygon = async (point, cn) => {
    if (polygons.length > 0) {
      let cv1 = cn.toLowerCase().replace(/\s/g, '');
      let cv2 = store.User.cl.city_name.toLowerCase().replace(/\s/g, '');

      if (cv1 == cv2) {
        for (let index = 0; index < polygons.length; index++) {
          const e = polygons[index];
          let p = e.latlngs.length;

          if (p > 0) {
            const c = isPointInPolygon(point, e.latlngs);

            if (c) {
              console.log('isarea');

              let coords = [];

              if (e.area.latlngs.length > 0) {
                coords = {
                  lat: point.latitude,
                  long: point.longitude,
                };
              }
              const obj = {
                city: e.city,
                area: e.area,
                coords: coords,
              };

              setisCenter(false);
              setloc(obj);
              setcity(e.city);
              setarea(e.area);
              setloader(false);

              break;
            } else {
              console.log('isnoarea : ');

              let ct = false;
              if (cn != '') {
                if (cityList.length > 0) {
                  cityList.map((e, i, a) => {
                    let aa = cn.toLowerCase().replace(/\s/g, '');
                    let b = e.name.toLowerCase().replace(/\s/g, '');
                    // console.log('aa : ', cn, 'b : ', b);
                    if (aa == b) {
                      ct = e;
                      return;
                    }
                  });
                }
              }

              if (ct) {
                let arr = [];
                arr = CityAreaData.filter(function (item) {
                  if (item.city) {
                    return item.city._id === ct._id;
                  }
                });

                let al = arr[0].areas;

                setisCenter(true);
                setcity(ct);
                setarea(al[0]);
              }
              //for ios if not city found your crnt loc
              else {
                let arr = [];
                arr = CityAreaData.filter(function (item) {
                  if (item.city) {
                    return item.city._id === cityList[0]._id;
                  }
                });

                let al = arr[0].areas;

                setisCenter(true);
                setcity(cityList[0]);
                setarea(al[0]);
              }

              setloader(false);
            }
          }
        }
      } else {
        let ct = false;
        if (cityList.length > 0) {
          cityList.map((e, i, a) => {
            let aa = cn.toLowerCase().replace(/\s/g, '');
            let b = e.name.toLowerCase().replace(/\s/g, '');
            if (aa == b) {
              ct = e;
              return;
            }
          });
        }
        if (ct) {
          let arr = [];
          arr = CityAreaData.filter(function (item) {
            if (item.city) {
              return item.city._id === ct._id;
            }
          });
          let al = arr[0].areas;
          if (al.length > 0) {
            setarea(al[0]);
          }
          setisCenter(true);
          setcity(ct);
        }
        setloader(false);
      }
    }
  };

  const ISPointInPolygonArea = async (point, a) => {
    let areaid = a._id;
    console.log('aid : ', areaid);
    console.log('p : ', point);
    if (polygons.length > 0) {
      let arr = [];
      arr = polygons.filter(function (item) {
        return item._id === areaid;
      });
      let ltlngs = arr[0].latlngs;
      console.log('ltlngs  is area k ha poly me : ', ltlngs);
      if (ltlngs.length > 0) {
        const c = isPointInPolygon(point, ltlngs);
        console.log('c : ', c);
        if (c) {
          console.log('is area');

          let coords = [];

          if (a.latlngs.length > 0) {
            coords = {
              lat: point.latitude,
              long: point.longitude,
            };
          }
          const obj = {
            city: city,
            area: a,
            coords: coords,
          };

          setisCenter2('nill');
          setarea(a);
          setloc(obj);
        } else {
          console.log('is no area');

          setisCenter2(true);
          setarea(a);
        }
      }
    }
  };

  const getCurrentLocationOne = () => {
    setloader(true);
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async position => {
        console.log('get c loc one res true');

        const cl = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

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

            const loc = {
              city_name: cityName,
              coords: cl,
            };

            store.User.setcl(loc);

            const point = {latitude: cl.latitude, longitude: cl.longitude};
            ISPointInPolygon(point, loc.city_name);

            return;
          })
          .catch(error => {
            setloader(false);
            if (error.code == 4) {
              Alert.alert(
                '',
                'Please enable billing account on your google map api key',
              );
            }
            console.warn('geocoder error : ', error);
            return;
          });
      },
      error => {
        setloader(false);
        if (error.code == 3) {
          if (!store.User.cl) {
            getCurrentLocationOne();
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

  const gotoMap = () => {
    // console.log('kasjaksj');
    // if (store.User.cl) {
    //   setisCenter('nill');
    //   setisCenter2('nill');
    //   props.navigation.navigate('Map', {
    //     city: city,
    //     area: area,
    //     loc: loc,
    //     setloc: c => setloc(c),
    //     setcity: c => setcity(c),
    //     setarea: c => setarea(c),
    //   });
    // } else {
    //   // Alert.alert('please turn on location');
    // }
    if (isLocation) {
      props.navigation.navigate('Map');
    }
  };

  const androidLocationEnablerDialog = c => {
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

  const hasPermissionIOS = async c => {
    const status = await Geolocation.requestAuthorization('whenInUse');

    console.log('In request iOS permissions : ', status);
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

  const hasPermissionAndroid = async c => {
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
      toast?.current?.show('Please allow permisiion to turn on location', 1000);
    }

    if (g === 'never_ask_again') {
      msg =
        'Please allow permision to use location in  app setting in device allow location permission to continue';
      Alert.alert(``, msg, [
        {
          text: 'Go to Settings',
          onPress: () => {
            openSetting();
          },
        },
        {text: "Don't Use Location", onPress: () => {}},
      ]);
    }

    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };

    return;
  };

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      store.General.setLocation(false);
      console.log('Requesting iOS Permissions');
      hasPermissionIOS();
      return;
    }
    if (Platform.OS === 'android') {
      console.log('Requesting Android Permissions');
      hasPermissionAndroid();
    }
  }

  const onRefresh = () => {
    console.log('onrefresh cal');
    store.User.getAllData(store.User.user ? 'user' : '');
  };

  const cross = () => {
    closeAllDropDown();
    props.navigation.goBack();
  };

  const confirm = () => {
    closeAllDropDown();
    if (city.length == 0) {
      toast?.current?.show('Please select city', toastduration);
      return;
    }
    if (area.length == 0) {
      toast?.current?.show('Please select area', toastduration);
      return;
    }

    if (loc) {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          store.User.setLocation(loc);
          if (screen == 'home') {
            props.route.params.setisReferesh(true);
            props.navigation.goBack();
            store.User.setcart({totalbill: 0, totalitems: 0, data: []});
          }
        } else {
          toast?.current?.show('Please connect internet', toastduration);
        }
      });

      return;
    }
  };

  const locationAccessCheck = () => {
    closeAllDropDown();
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        requestPermissions();
      } else {
        toast?.current?.show('Please connect internet', toastduration);
      }
    });
  };

  const closeAllDropDown = () => {
    let c = false;
    Keyboard.dismiss();
    setisDropDownArea(c);
    setisDropDownCity(c);
  };

  const renderDropDown = c => {
    let data = [];

    if (c == 'city') {
      data = cityList;
    } else if (c == 'area') {
      data = areaList;
    }

    const onclickSelect = d => {
      // console.log('city: ', d);
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          if (c == 'city') {
            if (isLocation && store.User.cl) {
              if (city._id !== d._id) {
                const point = {
                  latitude: store.User.cl.coords.latitude,
                  longitude: store.User.cl.coords.longitude,
                };
                ISPointInPolygon(point, d.name);
              }
            } else {
              requestPermissions('');
            }
          } else if (c == 'area') {
            if (area._id !== d._id) {
              const point = {
                latitude: store.User.cl.coords.latitude,
                longitude: store.User.cl.coords.longitude,
              };
              ISPointInPolygonArea(point, d);
            }
          }
        } else {
          toast?.current?.show('Please connect internet', toastduration);
        }
      });
    };

    // console.log('drop down data : ', data);

    return (
      <theme.DropDown
        data={data}
        onSelectItem={d => {
          onclickSelect(d);
        }}
        setVisible={d => {
          closeAllDropDown();
        }}
        search={data.length > 0 ? true : false}
        c={c}
        absolute={false}
      />
    );
  };

  const renderLocationAccessButton = () => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={locationAccessCheck}
          style={styles.BottomButton}>
          <Text style={styles.buttonTextBottom}>Allow Location Access</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderLocateButton = () => {
    return (
      <>
        <TouchableOpacity
          disabled={!isLocation ? true : false}
          activeOpacity={0.6}
          onPress={gotoMap}
          style={[
            styles.BottomButton2,
            {
              backgroundColor: !isLocation
                ? theme.color.disableBack
                : theme.color.background,
              borderWidth: !isLocation ? 0 : 0.6,
            },
          ]}>
          <Text
            style={[
              styles.buttonTextBottom2,
              {
                color: !isLocation
                  ? theme.color.subTitleLight
                  : theme.color.button1,
                fontFamily: !isLocation
                  ? theme.fonts.fontNormal
                  : theme.fonts.fontMedium,
              },
            ]}>
            Enter my location
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderStatusBar = () => {
    return (
      <>
        <StatusBar
          translucent={false}
          backgroundColor={theme.color.background}
          barStyle={'dark-content'}
        />
      </>
    );
  };

  return (
    <SafeAreaProvider style={styles.container}>
      {renderStatusBar()}
      <utils.ServerRes load={store.General.isServerError} />
      <utils.Loader load={loader} text="Please wait" />
      {!internet && <utils.InternetMessage />}
      {/* <View style={styles.cross}>
        {store.User.location && (
          <TouchableOpacity activeOpacity={0.6} onPress={cross}>
            <utils.vectorIcon.Ionicons
              name="close-sharp"
              color={theme.color.subTitleLight}
              size={30}
            />
          </TouchableOpacity>
        )}
      </View> */}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section1}>
          <Image
            style={styles.logo}
            source={require('../../assets/images/logo/img.png')}
          />
        </View>

        <View style={styles.section2}>
          <Text style={styles.title1}>Find restaurants near you!</Text>
          <Text style={styles.title2}>
            By allowing location access, you can search for restaurant near you
            and receive more accurate delivery.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.section3}>
        {!isLocation && renderLocationAccessButton()}
        {renderLocateButton()}
      </View>
      <Toast ref={toast} position="center" />
    </SafeAreaProvider>
  );
}
